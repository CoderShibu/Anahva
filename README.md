# Anahva Backend

Privacy-first, AI-assisted mental wellness platform backend for India.

## Features

- 🔐 **Secure Authentication**: JWT-based sessions with demo mode support
- 🔒 **End-to-End Encryption**: AES-256-GCM encryption for sensitive data
- 🧠 **AI Chat Service**: LISTEN, REFLECT, and CALM modes with safety constraints
- 📔 **Encrypted Journaling**: Never stores plaintext journal entries
- 🛡️ **Safety & Crisis Support**: Tiered response system with grounding exercises
- 📊 **Insights Engine**: Pattern awareness (no behavioral prediction)
- 🌍 **Multi-language**: English and Hindi support
- 🕰️ **Time-aware Logic**: Special handling for late-night interactions
- 📋 **Data Transparency**: Full control over data with purge and forget capabilities
- 🚨 **Audit Logging**: System events only, no user content

## Tech Stack

- **Runtime**: Node.js (>=18)
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Sessions**: Redis
- **Security**: JWT, AES-256-GCM, Helmet, CORS
- **AI**: OpenAI (optional, with abstraction layer)

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- Redis >= 6 (optional, falls back to memory store)

## Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Generate encryption key** (32 bytes, base64 encoded):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

4. **Set up database**:
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

5. **Start Redis** (optional):
```bash
redis-server
```

## Configuration

### Required Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT signing
- `ENCRYPTION_KEY`: 32-byte base64-encoded encryption key

### Optional Environment Variables

- `OPENAI_API_KEY`: OpenAI API key for AI features
- `REDIS_URL`: Redis connection URL (default: `redis://localhost:6379`)
- `PORT`: Server port (default: `3000`)
- `NODE_ENV`: Environment (`development`, `production`)

## Running

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/demo` - Demo login (non-production only)
- `POST /api/auth/anonymous` - Create anonymous session
- `PUT /api/auth/language` - Update session language
- `GET /api/auth/verify` - Verify session
- `POST /api/auth/logout` - Logout

### Journal
- `POST /api/journal/create` - Create journal entry (encrypted)
- `GET /api/journal/list` - List journal entries
- `DELETE /api/journal/:id` - Delete journal entry

### Chat
- `POST /api/chat/message` - Send chat message
- `GET /api/chat/session` - Get chat session info
- `PUT /api/chat/mode` - Update chat mode (LISTEN/REFLECT/CALM)

### Insights
- `GET /api/insights/generate` - Generate insights
- `GET /api/insights/history` - Get insights history

### Safety
- `GET /api/safety/grounding` - Get grounding exercise
- `GET /api/safety/resources` - Get external help resources
- `POST /api/safety/assess` - Assess message safety
- `POST /api/safety/emergency` - Request emergency alert (requires consent)

### Data Transparency
- `GET /api/settings/data/summary` - Get data summary
- `DELETE /api/settings/data/purge` - Purge all data
- `POST /api/settings/memory/forget` - Forget all memories

## Security Features

- ✅ Rate limiting (Redis-backed or memory fallback)
- ✅ Input sanitization
- ✅ JWT token rotation
- ✅ Encrypted secrets
- ✅ Audit logging (system events only)
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Never stores plaintext journals
- ✅ Never diagnoses mental conditions
- ✅ Never profiles users

## Privacy Guarantees

- ❌ **Never stores PII by default**
- ❌ **Never stores plaintext journal content**
- ❌ **Never logs chat content**
- ❌ **Never sells or shares data**
- ❌ **Never optimizes for addiction**
- ✅ **Client-side encryption for journals**
- ✅ **Embeddings only for AI memory**
- ✅ **Hard delete for data purge**
- ✅ **Explicit consent for all sensitive operations**

## AI Safety Constraints

The AI service enforces strict constraints:

- ❌ NO medical diagnosis
- ❌ NO medical advice
- ❌ NO authority statements
- ❌ NO behavioral profiling
- ✅ Socratic questioning only
- ✅ Empathetic listening
- ✅ Grounding techniques
- ✅ Supportive reflection

## Database Schema

See `prisma/schema.prisma` for the complete database schema.

Key models:
- `Session` - User sessions
- `Journal` - Encrypted journal entries
- `Memory` - AI memory embeddings (no raw text)
- `ChatSession` - Chat session metadata
- `Insight` - Pattern insights (metadata only)
- `SafetyEvent` - Safety events and consent logs
- `AuditLog` - System audit logs

## Development

### Database Migrations
```bash
npm run db:migrate
```

### Prisma Studio
```bash
npm run db:studio
```

## License

Private project - All rights reserved

