// server.js - Anahata Backend (Official)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';
import https from 'https';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// PREVENT CRASHES
process.on('uncaughtException', (err) => {
    console.error('🔥 UNCAUGHT EXCEPTION:', err);
    // Keep running
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 UNHANDLED REJECTION:', reason);
    // Keep running
});

// Database
const dbPath = process.env.VERCEL
    ? '/tmp/anahata.db'
    : join(__dirname, '..', 'dev.db');

const db = new Database(dbPath, { verbose: null });
db.pragma('foreign_keys = OFF');

// Verify Tables
try {
    db.exec(`CREATE TABLE IF NOT EXISTS Session (session_id TEXT PRIMARY KEY);`);
    db.exec(`CREATE TABLE IF NOT EXISTS Journal (id TEXT PRIMARY KEY, session_id TEXT, encrypted_payload TEXT, allow_ai_memory INTEGER, created_at TEXT, updated_at TEXT, deleted_at TEXT);`);
    if (!db.prepare('SELECT 1 FROM Session WHERE session_id = ?').get('demo-session')) {
        db.prepare('INSERT INTO Session (session_id) VALUES (?)').run('demo-session');
    }
} catch (e) { }

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ==========================================
// CHAT - GOOGLE GEMINI NATIVE HTTPS (No SDK)
// ==========================================

const nativeRequest = (path, prompt) => {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });
        const options = {
            hostname: 'generativelanguage.googleapis.com',
            port: 443,
            path: path,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                if (res.statusCode === 200) resolve(data);
                else reject(new Error(`Status ${res.statusCode}: ${data}`));
            });
        });
        req.on('error', e => reject(e));
        req.write(body);
        req.end();
    });
};

const callGemini = async (message, mode) => {
    const prompt = `You are Anahata, a wellness AI. Mode: ${mode}. User: "${message}". Respond warmly (2-3 sentences).`;

    // ONLY USE MODELS CONFIRMED AVAILABLE
    const attempts = [
        // Primary: Gemini 2.0 Flash (Stable)
        `/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,

        // Fallback: Gemini 2.5 Flash (New Stable)
        `/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,

        // Fallback: Gemini Flash Latest (Alias)
        `/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GOOGLE_API_KEY}`
    ];

    let lastError = null;

    for (const path of attempts) {
        try {
            const raw = await nativeRequest(path, prompt);
            const json = JSON.parse(raw);
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) return text;
        } catch (e) {
            lastError = e;
            console.log(`⚠️  Failed: ${e.message.substring(0, 100)}`);
        }
    }
    throw lastError || new Error("All endpoints failed. Verified models: gemini-2.0-flash");
};

app.post('/api/chat/message', async (req, res) => {
    try {
        const { message, mode = 'LISTEN' } = req.body;
        if (!message?.trim()) return res.status(400).json({ error: 'Message required' });

        console.log(`📩 [${mode}] "${message.substring(0, 50)}..."`);

        const responseText = await callGemini(message, mode);
        console.log(`✅ GEMINI: "${responseText.substring(0, 50)}..."`);

        res.json({
            response: responseText,
            mode,
            ai: true,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ CHAT FAILED:', error);
        res.status(503).json({ error: 'AI Error', message: error.message, stack: error.stack });
    }
});

// ==========================================
// JOURNAL - STORAGE & MANAGEMENT
// ==========================================

app.post('/api/journal/create', (req, res) => {
    try {
        const id = randomUUID();
        db.prepare('INSERT INTO Journal (id, session_id, encrypted_payload, created_at, updated_at) VALUES (?, ?, ?, ?, ?)').run(id, 'demo-session', req.body.encrypted_payload, new Date().toISOString(), new Date().toISOString());
        res.json({ success: true, id });
    } catch (e) { res.status(500).json({ success: false }); }
});

app.get('/api/journal/list', (req, res) => {
    const journals = db.prepare("SELECT * FROM Journal WHERE session_id='demo-session' AND (deleted_at IS NULL OR deleted_at='')").all();
    res.json({ success: true, journals });
});

// GENERIC GEMINI CALL (For Analysis)
const generateContent = async (prompt) => {
    // ONLY USE MODELS CONFIRMED AVAILABLE
    const attempts = [
        `/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
        `/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
        `/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GOOGLE_API_KEY}`
    ];
    let lastError = null;
    for (const path of attempts) {
        try {
            const raw = await nativeRequest(path, prompt);
            const json = JSON.parse(raw);
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) return text;
        } catch (e) {
            lastError = e;
        }
    }
    throw lastError || new Error("All endpoints failed.");
};

app.post('/api/journal/analyze', async (req, res) => {
    try {
        const { journals } = req.body;
        if (!journals || !Array.isArray(journals) || journals.length === 0) {
            return res.json({ success: true, analysis: [] });
        }

        console.log(`🧠 Analyzing ${journals.length} journals...`);

        // Prompt for Analysis
        let prompt = "Analyze the mental health progress based on these journal entries. Return strictly valid JSON array of objects: [{ date: 'YYYY-MM-DD', score: number (0-100 indicating wellness), sentiment: 'Positive'|'Neutral'|'Negative' }]. Do not include markdown formatting or explanations. detailed JSON only.\n\nEntries:\n";

        // Limit to last 20 for performance
        const recentJournals = journals.slice(-20);
        recentJournals.forEach(j => {
            prompt += `Date: ${j.date}\nContent: ${j.content}\n---\n`;
        });

        const responseText = await generateContent(prompt);
        console.log("✅ Analysis Complete");

        // Clean markdown
        let cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanJson);

        res.json({ success: true, analysis: data });
    } catch (e) {
        console.error('Analysis Error:', e);
        res.status(500).json({ success: false, error: e.message });
    }
});

app.delete('/api/journal/clear', (req, res) => {
    try {
        const result = db.prepare("UPDATE Journal SET deleted_at = ? WHERE session_id = 'demo-session' AND (deleted_at IS NULL OR deleted_at = '')").run(new Date().toISOString());
        console.log(`🗑️ Cleared ${result.changes} journal entries`);
        res.json({ success: true, count: result.changes });
    } catch (e) {
        console.error('Clear Journals Error:', e);
        res.status(500).json({ success: false, error: e.message });
    }
});

app.delete('/api/journal/:id', (req, res) => {
    db.prepare("UPDATE Journal SET deleted_at=? WHERE id=?").run(new Date().toISOString(), req.params.id);
    res.json({ success: true });
});

// Auth Stubs
app.post('/api/auth/demo', (req, res) => res.json({ token: 'demo', session_id: 'demo-session', success: true }));
app.get('/api/auth/verify', (req, res) => res.json({ valid: true, success: true }));

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    app.listen(PORT, () => console.log(`🚀 ANAHATA SERVER RUNNING ON ${PORT}`));
}

export default app;
