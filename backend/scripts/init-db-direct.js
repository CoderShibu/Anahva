// Simple DB initialization without Prisma migrations
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'dev.db');
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS Session (
    id TEXT PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    language TEXT DEFAULT 'EN',
    demo INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT NOT NULL,
    last_active TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Journal (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    encrypted_payload TEXT NOT NULL,
    allow_ai_memory INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    FOREIGN KEY (session_id) REFERENCES Session(session_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ChatSession (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    mode TEXT DEFAULT 'LISTEN',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES Session(session_id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_session_id ON Session(session_id);
  CREATE INDEX IF NOT EXISTS idx_journal_session ON Journal(session_id);
  CREATE INDEX IF NOT EXISTS idx_journal_created ON Journal(created_at);
  CREATE INDEX IF NOT EXISTS idx_chat_session ON ChatSession(session_id);
`);

console.log('✅ Database initialized successfully!');
db.close();
