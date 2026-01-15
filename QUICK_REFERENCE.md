# ⚡ ANAHVA BACKEND - QUICK REFERENCE CARD

> Bookmark this page for quick access to everything

---

## 🚀 START BACKEND (60 seconds)

```powershell
cd backend
npm run dev
```

**Expected:** `🚀 Server running on port 3000`

---

## 🧪 TEST EVERYTHING (30 seconds)

```powershell
.\test-api.ps1
```

**Expected:** All 7 tests pass ✅

---

## 📚 DOCUMENTATION QUICK LINKS

| Document | When to Read |
|----------|--------------|
| **BACKEND_READY.md** | Overview & features |
| **IMPLEMENTATION_SUMMARY.md** | What was delivered |
| **BACKEND_SETUP.md** | Full setup & deployment |
| **WINDOWS_QUICKSTART.md** | Windows-specific steps |
| **FRONTEND_INTEGRATION.md** | API integration code |
| **IMPLEMENTATION_CHECKLIST.md** | What's implemented |

---

## 🔑 Key Files

```
backend/
├── .env                     ← Configuration (API key here!)
├── package.json             ← Dependencies
├── src/
│   ├── server.js           ← Entry point
│   ├── app.js              ← Express setup
│   ├── routes/             ← API endpoints
│   ├── controllers/        ← Request handlers
│   ├── services/           ← Business logic
│   │   └── ai.service.js   ← Gemini AI integration ⭐
│   └── middlewares/        ← Auth, rate limit, etc.
├── prisma/
│   └── schema.prisma       ← Database schema
└── scripts/
    └── generate-key.js     ← Key generation
```

---

## 🎯 7 CORE APIS

### 1. Health Check
```bash
GET http://localhost:3000/health
```

### 2. Login (Demo)
```bash
POST http://localhost:3000/api/auth/demo
Body: {"name":"Shibasish","password":"Shibasish"}
```

### 3. Login (Anon)
```bash
POST http://localhost:3000/api/auth/anonymous
Body: {"language":"EN"}
```

### 4. Create Journal
```bash
POST http://localhost:3000/api/journal/create
Header: Authorization: Bearer TOKEN
Body: {"encrypted_payload":"...","allow_ai_memory":false}
```

### 5. Get Journals
```bash
GET http://localhost:3000/api/journal/list
Header: Authorization: Bearer TOKEN
```

### 6. Chat with AI
```bash
POST http://localhost:3000/api/chat/message
Header: Authorization: Bearer TOKEN
Body: {"message":"...","mode":"CALM"}
```

### 7. Delete Journal
```bash
DELETE http://localhost:3000/api/journal/ID
Header: Authorization: Bearer TOKEN
```

---

## 🔑 SETUP IN 5 STEPS

### 1. Install
```powershell
npm install
```

### 2. Generate Keys
```powershell
node scripts/generate-key.js
```

### 3. Update .env
```env
GOOGLE_API_KEY=AIzaSyCBKYEr33WA59RJpQBMX_508s-GhxuVxLY
JWT_SECRET=<paste from step 2>
ENCRYPTION_KEY=<paste from step 2>
DATABASE_URL=file:./dev.db
```

### 4. Setup Database
```powershell
npm run db:generate
npm run db:migrate
```

### 5. Start
```powershell
npm run dev
```

---

## 🧪 TEST FLOW

```powershell
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Tests
.\test-api.ps1
```

**What it tests:**
- [x] Health endpoint
- [x] Demo login
- [x] Token verification
- [x] Journal creation
- [x] **Persistence** (journal survives refresh)
- [x] AI response
- [x] Journal deletion

---

## 🐛 QUICK FIXES

### Port in use
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
npm run dev
```

### Database error
```powershell
Remove-Item dev.db -Force
npm run db:migrate
npm run dev
```

### Missing dependencies
```powershell
npm install
npm run dev
```

### API not responding
```powershell
curl.exe http://localhost:3000/health
# Should return: {"status":"ok",...}
```

---

## 💬 CHAT WITH AI

### JavaScript Example
```javascript
const token = sessionStorage.getItem('token');

const response = await fetch(
  'http://localhost:3000/api/chat/message',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'I feel stressed',
      mode: 'CALM'
    })
  }
);

const { response: aiMessage } = await response.json();
console.log(aiMessage);
```

### Modes
- `LISTEN` - Empathetic listening
- `REFLECT` - Socratic questioning
- `CALM` - Grounding techniques

---

## 💾 CREATE & PERSIST JOURNAL

```javascript
// 1. Encrypt on frontend
const plaintext = 'My journal entry...';
const encrypted = await encryptContent(plaintext);

// 2. Send to backend
const response = await fetch(
  'http://localhost:3000/api/journal/create',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      encrypted_payload: encrypted,
      allow_ai_memory: false
    })
  }
);

const { journal } = await response.json();
console.log('Saved:', journal.id);

// 3. Refresh page, then retrieve
const list = await fetch(
  'http://localhost:3000/api/journal/list',
  { headers: { 'Authorization': `Bearer ${token}` } }
);

const { journals } = await list.json();
console.log('Still there:', journals.length > 0);
// ✅ Proves backend persistence!
```

---

## 🔐 SECURITY SUMMARY

| Feature | Details |
|---------|---------|
| **Auth** | JWT + session table |
| **Encryption** | AES-256-GCM on journals |
| **Network** | CORS, rate limit, Helmet |
| **Validation** | Input sanitization |
| **Logging** | Audit trail (no content) |

---

## 🚀 DEPLOY TO PRODUCTION

### 1. Use PostgreSQL
```env
DATABASE_URL=postgresql://user:password@host/anahva
```

### 2. Generate Keys
```powershell
node scripts/generate-key.js
```

### 3. Disable Demo
```env
DEMO_MODE_ENABLED=false
NODE_ENV=production
```

### 4. Set Secrets
Use environment variable service (AWS, Azure, etc)

### 5. Start
```bash
npm install --production
npm run db:migrate
npm start
```

---

## 📊 STATUS CHECKS

### Is backend running?
```bash
curl http://localhost:3000/health
```

### Can I login?
```bash
curl -X POST http://localhost:3000/api/auth/demo \
  -H "Content-Type: application/json" \
  -d '{"name":"Shibasish","password":"Shibasish"}'
```

### Do journals persist?
```
1. Create journal
2. Refresh page
3. GET /api/journal/list
4. Journal still there? ✅
```

### Is AI working?
```bash
POST /api/chat/message
Body: {"message":"I feel sad","mode":"CALM"}
# Response should come from Gemini
```

---

## 🎯 PERSISTENCE TEST (MOST IMPORTANT)

This proves backend is working:

```powershell
# 1. Start backend
npm run dev

# 2. Create journal (PowerShell)
$token = (curl -Method POST http://localhost:3000/api/auth/demo `
  -ContentType "application/json" `
  -Body '{"name":"Shibasish","password":"Shibasish"}' | ConvertFrom-Json).token

curl -Method POST http://localhost:3000/api/journal/create `
  -Headers @{"Authorization"="Bearer $token"} `
  -ContentType "application/json" `
  -Body '{"encrypted_payload":"test","allow_ai_memory":false}'

# 3. Refresh page or restart backend
# (Simulate user closing browser)

# 4. Get journals
curl http://localhost:3000/api/journal/list `
  -Headers @{"Authorization"="Bearer $token"}

# ✅ Journal is still there = Backend persistence confirmed!
```

---

## 🧠 AI SYSTEM PROMPT (Safety)

The AI is constrained by:

```
❌ NO medical diagnosis
❌ NO authority statements
❌ NO behavioral prediction
✅ Socratic questioning
✅ Empathetic listening
✅ Grounding techniques
```

---

## 📞 GET HELP

### Error in Terminal?
```powershell
# Check logs
Get-Content logs/*.log -Tail 50

# Enable debug
# Add to .env: LOG_LEVEL=debug
```

### Can't Login?
```powershell
# Check credentials
# Username: Shibasish
# Password: Shibasish
# (only in dev, demo mode)

# Verify token wasn't expired
# JWT expires in 7 days
```

### Journal Not Saving?
```powershell
# Check database exists
dir dev.db

# Check database isn't corrupted
npm run db:migrate

# Check encryption key is valid
node scripts/generate-key.js
```

### AI Not Responding?
```powershell
# Check Gemini API key
# Edit .env and verify GOOGLE_API_KEY=AIzaSyCBKYEr33WA59RJpQBMX_508s-GhxuVxLY

# Check internet connection
curl.exe https://www.google.com

# Check API rate limit
# Wait a minute and retry
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Backend starts with `npm run dev`
- [ ] Health check responds (GET /health)
- [ ] Can login (POST /api/auth/demo)
- [ ] Journal persists after refresh
- [ ] AI responds with Gemini message
- [ ] All 7 tests pass (`.\test-api.ps1`)
- [ ] No errors in logs

**All checked? Backend is ready!** 🎉

---

## 📚 FULL DOCUMENTATION

For complete details, see:
- **`backend/BACKEND_SETUP.md`** - Everything
- **`backend/FRONTEND_INTEGRATION.md`** - Frontend code
- **`IMPLEMENTATION_SUMMARY.md`** - What was built

---

**Bookmark this page for quick reference!** ⭐
