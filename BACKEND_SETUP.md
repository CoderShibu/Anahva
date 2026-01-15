# 🚀 Anahva Backend - Complete Setup Guide

> Production-grade, privacy-first mental wellness backend powered by Google Gemini AI

## 📋 Table of Contents

1. [Architecture](#architecture)
2. [Quick Start](#quick-start)
3. [Environment Setup](#environment-setup)
4. [Database Setup](#database-setup)
5. [API Documentation](#api-documentation)
6. [Testing the Backend](#testing-the-backend)
7. [Core Behaviors](#core-behaviors)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture

### Tech Stack (MANDATORY)

| Component | Technology |
|-----------|-----------|
| **Runtime** | Node.js >= 18 |
| **Framework** | Express.js 4.18+ |
| **Database** | PostgreSQL (prod) or SQLite (dev) |
| **ORM** | Prisma |
| **Auth** | JWT + bcrypt |
| **Encryption** | Node.js crypto (AES-256-GCM) |
| **AI** | Google Gemini API (backend only) |
| **Logging** | Winston |
| **Security** | Helmet, CORS, Rate Limiting |

### Project Structure

```
backend/
├── src/
│   ├── server.js           # Entry point
│   ├── app.js              # Express app setup
│   ├── config/             # Configuration
│   │   ├── db.js           # Prisma client
│   │   ├── env.js          # Environment loader
│   │   └── security.js     # Security config
│   ├── routes/             # API routes
│   │   ├── auth.routes.js
│   │   ├── journal.routes.js
│   │   ├── chat.routes.js
│   │   └── ...
│   ├── controllers/        # Route handlers
│   ├── services/           # Business logic
│   │   ├── ai.service.js        # ⭐ Gemini integration
│   │   ├── encryption.service.js # Data encryption
│   │   ├── journal.service.js    # Journal CRUD
│   │   └── ...
│   ├── middlewares/        # Express middleware
│   │   ├── auth.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   └── error.middleware.js
│   └── utils/              # Utilities
├── prisma/
│   └── schema.prisma       # Database schema
├── scripts/
│   └── generate-key.js     # Key generation
├── .env                    # Environment variables (NEVER commit!)
├── package.json
└── README.md
```

---

## ⚡ Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Generate Security Keys
```bash
node scripts/generate-key.js
```

Output:
```
🔐 Security Keys Generated for .env file:
======================================================================

# JWT Secret (for session tokens):
JWT_SECRET=a1b2c3d4e5f6...

# Encryption Key (for data encryption):
ENCRYPTION_KEY=ABC123DEF456GHI789JKL012MNO=

======================================================================
```

### 3. Configure `.env`
```bash
# Copy the keys from above into .env:
GOOGLE_API_KEY=AIzaSyCBKYEr33WA59RJpQBMX_508s-GhxuVxLY
JWT_SECRET=<paste from generate-key.js>
ENCRYPTION_KEY=<paste from generate-key.js>

# For local SQLite development:
DATABASE_URL=file:./dev.db

# Other defaults are already set
```

### 4. Set Up Database
```bash
# Generate Prisma client
npm run db:generate

# Create SQLite database and tables
npm run db:migrate
```

### 5. Start Backend
```bash
npm run dev
```

**Expected Output:**
```
✅ Database connected
🚀 Server running on port 3000
📝 Environment: development
🔐 Demo mode: enabled
```

### 6. Test Health Endpoint
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-11T10:30:00.000Z",
  "service": "anahva-backend"
}
```

---

## 🔧 Environment Setup

### `.env` Configuration

```env
# ============================================
# ANAHVA BACKEND - ENVIRONMENT CONFIGURATION
# ============================================

# ✅ Google Gemini API Key (REQUIRED for AI features)
GOOGLE_API_KEY=AIzaSyCBKYEr33WA59RJpQBMX_508s-GhxuVxLY

# ❌ OpenAI API Key (OPTIONAL - Gemini takes precedence)
# OPENAI_API_KEY=

# ============================================
# DATABASE CONFIGURATION
# ============================================

# For PostgreSQL (production):
# DATABASE_URL=postgresql://user:password@localhost:5432/anahva

# For SQLite (local development - recommended):
DATABASE_URL=file:./dev.db

# ============================================
# SECURITY KEYS
# ============================================

# Generate with: node scripts/generate-key.js
JWT_SECRET=your-super-secret-jwt-key-change-this
ENCRYPTION_KEY=your-base64-encoded-32-byte-key

# ============================================
# ENVIRONMENT & PORT
# ============================================

NODE_ENV=development
PORT=3000

# ============================================
# REDIS (Optional)
# ============================================

REDIS_URL=redis://localhost:6379

# ============================================
# DEMO MODE (Development only)
# ============================================

DEMO_MODE_ENABLED=true
DEMO_USERNAME=Shibasish
DEMO_PASSWORD=Shibasish

# ============================================
# RATE LIMITING & SECURITY
# ============================================

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
SESSION_TIMEOUT_MS=604800000

# ============================================
# LOGGING
# ============================================

LOG_LEVEL=info
LOG_DIR=./logs
```

### Environment Files Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `GOOGLE_API_KEY` | AI responses via Gemini | `AIzaSyC...` |
| `DATABASE_URL` | Database connection | `file:./dev.db` |
| `JWT_SECRET` | Session token signing | 32+ bytes, hex |
| `ENCRYPTION_KEY` | Data encryption | 32 bytes, base64 |
| `NODE_ENV` | App environment | `development` |
| `PORT` | Server port | `3000` |

---

## 🗄️ Database Setup

### SQLite (Recommended for Development)

```bash
# 1. Set DATABASE_URL=file:./dev.db in .env
# 2. Generate Prisma client
npm run db:generate

# 3. Create database and tables
npm run db:migrate

# 4. View database schema
npm run db:studio
```

**Database file location:** `backend/dev.db`

### PostgreSQL (For Production)

```bash
# 1. Create PostgreSQL database
createdb anahva

# 2. Update .env:
DATABASE_URL=postgresql://user:password@localhost:5432/anahva

# 3. Run migrations
npm run db:migrate
```

### Database Schema

**Core Tables:**

| Table | Purpose |
|-------|---------|
| `sessions` | User sessions, authentication |
| `journals` | Encrypted journal entries |
| `chat_sessions` | Chat metadata (no content stored) |
| `memories` | AI embeddings for context (optional) |
| `insights` | Aggregated patterns (no raw data) |
| `safety_events` | Safety flags and consent |
| `audit_logs` | System events (no user content) |

---

## 📡 API Documentation

### 1️⃣ Health Check (No Auth Required)

**Endpoint:** `GET /health`

**Purpose:** Verify backend is running (used by frontend)

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-11T10:30:00.000Z",
  "service": "anahva-backend"
}
```

**Test:**
```bash
curl http://localhost:3000/health
```

---

### 2️⃣ Authentication APIs

#### Demo Login (Development Only)

**Endpoint:** `POST /api/auth/demo`

**Body:**
```json
{
  "name": "Shibasish",
  "password": "Shibasish"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "session": {
    "session_id": "uuid",
    "language": "EN",
    "demo": true
  }
}
```

**Test:**
```bash
curl -X POST http://localhost:3000/api/auth/demo \
  -H "Content-Type: application/json" \
  -d '{"name":"Shibasish","password":"Shibasish"}'
```

#### Anonymous Session

**Endpoint:** `POST /api/auth/anonymous`

**Body:**
```json
{
  "language": "EN"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "session": {
    "session_id": "uuid",
    "language": "EN",
    "demo": false
  }
}
```

**Test:**
```bash
curl -X POST http://localhost:3000/api/auth/anonymous \
  -H "Content-Type: application/json" \
  -d '{"language":"EN"}'
```

#### Verify Session

**Endpoint:** `GET /api/auth/verify`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "session": {
    "session_id": "uuid",
    "language": "EN",
    "demo": false
  }
}
```

**Test:**
```bash
curl -X GET http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3️⃣ Journal APIs (CORE - Persistence Proof)

#### Create Journal Entry

**Endpoint:** `POST /api/journal/create`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "encrypted_payload": "base64-encoded-encrypted-content",
  "allow_ai_memory": false
}
```

**Response:**
```json
{
  "success": true,
  "journal": {
    "id": "uuid",
    "session_id": "uuid",
    "encrypted_payload": "base64...",
    "allow_ai_memory": false,
    "created_at": "2026-01-11T10:30:00.000Z"
  }
}
```

**⭐ PERSISTENCE TEST:**
1. Create a journal entry
2. Refresh the page
3. Fetch journals (below)
4. **Entry must still exist** ← Proof backend is working!

#### Get Journal Entries

**Endpoint:** `GET /api/journal/list?limit=50&offset=0`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "journals": [
    {
      "id": "uuid",
      "session_id": "uuid",
      "encrypted_payload": "base64...",
      "allow_ai_memory": false,
      "created_at": "2026-01-11T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

#### Delete Journal Entry

**Endpoint:** `DELETE /api/journal/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Journal entry deleted"
}
```

---

### 4️⃣ Chat / AI API

**Endpoint:** `POST /api/chat/message`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "message": "I'm feeling overwhelmed",
  "mode": "LISTEN",
  "allow_memory": false
}
```

**Modes:**
- `LISTEN` - Empathetic listening
- `REFLECT` - Guided self-reflection
- `CALM` - Grounding & calming techniques

**Response:**
```json
{
  "success": true,
  "response": "I'm here to listen. Can you tell me what's making you feel overwhelmed?",
  "mode": "LISTEN",
  "language": "EN"
}
```

**⭐ KEY FEATURE:**
- AI response comes from **backend only**
- Frontend never calls Gemini API directly
- Request goes: Frontend → Backend → Gemini → Backend → Frontend

---

## 🧪 Testing the Backend

### Complete Test Flow

#### 1. Health Check
```bash
curl http://localhost:3000/health
```

#### 2. Create Session
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/demo \
  -H "Content-Type: application/json" \
  -d '{"name":"Shibasish","password":"Shibasish"}' \
  | jq -r '.token')

echo "Token: $TOKEN"
```

#### 3. Create Journal Entry
```bash
JOURNAL=$(curl -s -X POST http://localhost:3000/api/journal/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "encrypted_payload": "abc123def456xyz789",
    "allow_ai_memory": false
  }')

echo "Journal created: $JOURNAL"
```

#### 4. Fetch Journals (PERSISTENCE TEST)
```bash
curl -s -X GET http://localhost:3000/api/journal/list \
  -H "Authorization: Bearer $TOKEN" | jq
```

**Expected: The journal from step 3 is still there!**

#### 5. Chat with AI
```bash
curl -s -X POST http://localhost:3000/api/chat/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I am feeling stressed",
    "mode": "CALM",
    "allow_memory": false
  }' | jq
```

---

## 🧠 Core Behaviors

### ✅ Behavior 1: User-Controlled Memory

```javascript
// ❌ If allow_ai_memory = false
- AI cannot store memories
- No embeddings created
- No context from past entries

// ✅ If allow_ai_memory = true
- Relevant past entries can inform AI responses
- Embeddings stored for similarity search
- User maintains full control
```

### ✅ Behavior 2: Privacy-First Design

```javascript
// Backend never stores plaintext journals
POST /journal/create
{
  "encrypted_payload": "base64-encrypted-data", // ← Only encrypted!
  "allow_ai_memory": false
}

// Backend treats content as opaque data
- No indexing on plaintext
- No full-text search
- Frontend is responsible for decryption display
```

### ✅ Behavior 3: Non-Directive AI

```javascript
// AI uses Socratic questioning
❌ Bad: "You should exercise more"
✅ Good: "What activities have helped you feel better in the past?"

// AI respects mode
LISTEN: Empathetic listening, open-ended questions
REFLECT: Guided self-discovery
CALM: Grounding exercises, breathing techniques
```

### ✅ Behavior 4: Persistence = Proof

```
Create Journal → Refresh Page → Journal Still Exists
                ↓
    Backend Persistence Confirmed
    (Not just localStorage!)
```

### ✅ Behavior 5: Failure Transparency

```javascript
// If backend is down:
Frontend actions FAIL explicitly
- No silent fallbacks
- No fake success responses
- User knows something is wrong

// Example error response:
{
  "error": "Internal Server Error",
  "message": "Failed to create journal entry"
}
```

---

## 🚀 Deployment

### For Production

#### 1. Use PostgreSQL
```env
DATABASE_URL=postgresql://user:password@host:5432/anahva
NODE_ENV=production
```

#### 2. Disable Demo Mode
```env
DEMO_MODE_ENABLED=false
```

#### 3. Generate Strong Keys
```bash
node scripts/generate-key.js
# Use these in production secrets manager
```

#### 4. Set Up Redis
```bash
# For session caching and rate limiting
redis-server --requirepass your-password
REDIS_URL=redis://:your-password@host:6379
```

#### 5. Environment Variables (Secrets Manager)
```bash
# Use environment variable service:
# - AWS Secrets Manager
# - Google Cloud Secret Manager
# - HashiCorp Vault
# - Azure Key Vault

# Never hardcode in code or .env files!
```

#### 6. Start Backend
```bash
npm start
```

### Docker Deployment (Optional)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src src
COPY prisma prisma
RUN npm run db:generate
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t anahva-backend .
docker run -p 3000:3000 --env-file .env anahva-backend
```

---

## 🔧 Troubleshooting

### Database Connection Errors

**Error:** `Error: ENOENT: no such file or directory`

**Solution:**
```bash
# For SQLite:
npm run db:migrate

# For PostgreSQL:
createdb anahva
npm run db:migrate
```

### Missing AI Key

**Error:** `⚠️  No AI API keys configured. Using fallback responses.`

**Solution:**
```bash
# Add to .env:
GOOGLE_API_KEY=AIzaSyCBKYEr33WA59RJpQBMX_508s-GhxuVxLY

# Or add OpenAI fallback:
OPENAI_API_KEY=sk-...
```

### Rate Limit Errors

**Error:** `429 Too Many Requests`

**Solution:**
Adjust in `.env`:
```bash
RATE_LIMIT_MAX_REQUESTS=100  # Increase limit
RATE_LIMIT_WINDOW_MS=900000  # Increase time window
```

### Encryption Key Errors

**Error:** `ENCRYPTION_KEY must be 32 bytes`

**Solution:**
```bash
# Regenerate with:
node scripts/generate-key.js

# Then update .env with the ENCRYPTION_KEY output
```

### Port Already in Use

**Error:** `Error: listen EADDRINUSE :::3000`

**Solution:**
```bash
# Change port in .env:
PORT=3001

# Or kill process using port 3000:
# Linux/Mac:
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 📞 Support

For issues or questions:
1. Check logs: `tail -f logs/*.log`
2. Verify `.env` configuration
3. Test with curl/Postman
4. Check network tab in browser DevTools
5. Enable debug logging: `LOG_LEVEL=debug`

---

## ✅ Verification Checklist

- [ ] `npm install` completed without errors
- [ ] `node scripts/generate-key.js` ran successfully
- [ ] `.env` file updated with keys and DB URL
- [ ] `npm run db:migrate` completed
- [ ] `npm run dev` shows "✅ Database connected"
- [ ] `curl http://localhost:3000/health` returns 200 OK
- [ ] Demo login works and returns token
- [ ] Journal can be created and persists after refresh
- [ ] Chat message returns AI response

**All green? Backend is ready! 🎉**

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Google Gemini API](https://ai.google.dev)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [OWASP Security Guidelines](https://owasp.org)
