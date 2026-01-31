// Complete backend with DIRECT HTTP calls to Gemini (no SDK issues!)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SQLite database
const dbPath = join(__dirname, '..', 'dev.db');
const db = new Database(dbPath);
console.log('✅ Database connected:', dbPath);

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'anahata-backend',
        environment: process.env.NODE_ENV || 'development'
    });
});

// ==========================================
// CHAT ENDPOINT - DIRECT HTTP TO GEMINI
// ==========================================

app.post('/api/chat/message', async (req, res) => {
    try {
        const { message, mode = 'LISTEN' } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log(`📩 Chat  (mode: ${mode}): "${message.substring(0, 40)}..."`);

        // Gemini API direct call
        const prompt = `You are Anahata, an empathetic mental wellness companion. User says: "${message}". Respond warmly in 2-3 sentences.`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (response.ok) {
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                console.log(`✅ Gemini: "${text.substring(0, 60)}..."`);
                return res.json({
                    response: text,
                    mode,
                    ai: true,
                    timestamp: new Date().toISOString()
                });
            }
        }

        throw new Error(`API error: ${response.status}`);

    } catch (error) {
        console.error('❌ Gemini failed:', error.message);

        // Better fallbacks
        const responses = {
            LISTEN: [
                "I hear you. Tell me more about how you're feeling.",
                "I'm listening. What's weighing on your mind?",
                "Thank you for sharing. How can I support you right now?"
            ],
            REFLECT: [
                "What do you think this feeling is trying to tell you?",
                "How do you usually deal with feelings like this?",
                "What would help you feel more at peace with this?"
            ],
            CALM: [
                "Take a deep breath with me. You're safe.",
                "Let's ground ourselves. Feel your feet on the floor.",
                "One breath at a time. You've got this."
            ]
        };

        const modeResponses = responses[req.body.mode] || responses.LISTEN;
        const randomResponse = modeResponses[Math.floor(Math.random() * modeResponses.length)];

        res.json({
            response: randomResponse,
            mode: req.body.mode || 'LISTEN',
            fallback: true,
            timestamp: new Date().toISOString()
        });
    }
});

app.get('/api/chat/session', (req, res) => {
    res.json({ mode: 'LISTEN', created_at: new Date().toISOString() });
});

app.put('/api/chat/mode', (req, res) => {
    res.json({ mode: req.body.mode || 'LISTEN', updated_at: new Date().toISOString() });
});

// ==========================================
// JOURNAL ENDPOINTS
// ==========================================

app.post('/api/journal/create', async (req, res) => {
    try {
        const { encrypted_payload, allow_ai_memory = false } = req.body;

        if (!encrypted_payload) {
            return res.status(400).json({ error: 'Content required' });
        }

        const id = randomUUID();
        const stmt = db.prepare(`
      INSERT INTO Journal (id, session_id, encrypted_payload, allow_ai_memory, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        const now = new Date().toISOString();
        stmt.run(id, 'demo-session', encrypted_payload, allow_ai_memory ? 1 : 0, now, now);

        console.log(`✅ Journal saved: ${id}`);
        res.json({ id, created_at: now, message: 'Saved!' });

    } catch (error) {
        console.error('❌ Journal error:', error.message);
        res.status(500).json({ error: 'Failed to save', details: error.message });
    }
});

app.get('/api/journal/list', (req, res) => {
    try {
        const stmt = db.prepare(`
      SELECT * FROM Journal
      WHERE session_id = 'demo-session' AND deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT 50
    `);

        const journals = stmt.all().map(j => ({
            id: j.id,
            encrypted_payload: j.encrypted_payload,
            allow_ai_memory: j.allow_ai_memory === 1,
            created_at: j.created_at,
            updated_at: j.updated_at
        }));

        res.json({ journals, total: journals.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/journal/:id', (req, res) => {
    try {
        const stmt = db.prepare(`UPDATE Journal SET deleted_at = ? WHERE id = ?`);
        stmt.run(new Date().toISOString(), req.params.id);
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// AUTH ENDPOINTS
// ==========================================

app.post('/api/auth/demo', (req, res) => {
    res.json({ token: 'demo-' + Date.now(), session_id: 'demo-session' });
});

app.post('/api/auth/anonymous', (req, res) => {
    res.json({ token: 'anon-' + Date.now(), session_id: 'anon-session' });
});

app.get('/api/auth/verify', (req, res) => {
    res.json({ valid: true });
});

app.post('/api/auth/logout', (req, res) => {
    res.json({ message: 'Logged out' });
});

// ==========================================
// START
// ==========================================

app.listen(PORT, () => {
    console.log('');
    console.log('========================================');
    console.log('🚀 Anahata Backend (HTTP Direct)');
    console.log('========================================');
    console.log(`✅ Port: ${PORT}`);
    console.log(`🤖 Gemini: ${process.env.GOOGLE_API_KEY ? 'Configured' : 'MISSING'}`);
    console.log(`💾 Database: ${dbPath}`);
    console.log('');
    console.log(`🔍 http://localhost:${PORT}/health`);
    console.log('========================================');
    console.log('⏳ Ready for requests...\n');
});

process.on('SIGINT', () => {
    console.log('\n👋 Shutting down...');
    db.close();
    process.exit(0);
});
