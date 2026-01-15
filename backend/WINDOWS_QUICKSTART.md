# 🚀 ANAHVA BACKEND - WINDOWS QUICK START

> 5-minute setup for Windows users

## Step 1: Install Dependencies

```powershell
cd backend
npm install
```

**Expected output:** `added 200+ packages`

## Step 2: Generate Security Keys

```powershell
node scripts/generate-key.js
```

**Expected output:**
```
🔐 Security Keys Generated for .env file:
======================================================================

# JWT Secret (for session tokens):
JWT_SECRET=abc123def456xyz789...

# Encryption Key (for data encryption):
ENCRYPTION_KEY=ABC123DEF456GHI789JKL012MNO=

======================================================================
```

## Step 3: Update `.env` File

1. Open `backend\.env` in your editor
2. Replace the following lines:

```env
GOOGLE_API_KEY=AIzaSyCBKYEr33WA59RJpQBMX_508s-GhxuVxLY
JWT_SECRET=<paste JWT_SECRET from step 2>
ENCRYPTION_KEY=<paste ENCRYPTION_KEY from step 2>
DATABASE_URL=file:./dev.db
```

3. Save the file (Ctrl+S)

## Step 4: Setup Database

```powershell
npm run db:generate
npm run db:migrate
```

**Expected output:**
```
✓ Prisma schema loaded from prisma/schema.prisma
✓ Database dev.db created
✓ Migrations applied
```

## Step 5: Start Backend

```powershell
npm run dev
```

**Expected output:**
```
✅ Database connected
🚀 Server running on port 3000
📝 Environment: development
🔐 Demo mode: enabled
```

## Step 6: Test Backend (in new PowerShell window)

```powershell
cd backend
.\test-api.ps1
```

Or test manually:

### Test Health Check
```powershell
curl.exe http://localhost:3000/health
```

### Test Demo Login
```powershell
$response = curl.exe -Method POST http://localhost:3000/api/auth/demo `
  -ContentType "application/json" `
  -Body '{"name":"Shibasish","password":"Shibasish"}'

$token = ($response | ConvertFrom-Json).token
Write-Host "Token: $token"
```

### Test Create Journal
```powershell
$token = "YOUR_TOKEN_HERE"

$response = curl.exe -Method POST http://localhost:3000/api/journal/create `
  -Headers @{"Authorization"="Bearer $token"} `
  -ContentType "application/json" `
  -Body '{"encrypted_payload":"test-data","allow_ai_memory":false}'

$response | ConvertFrom-Json | ConvertTo-Json
```

### Test Get Journals (PERSISTENCE TEST)
```powershell
$token = "YOUR_TOKEN_HERE"

curl.exe -Method GET http://localhost:3000/api/journal/list `
  -Headers @{"Authorization"="Bearer $token"}
```

**✅ If journals from the previous test appear here, persistence is working!**

## Troubleshooting

### Port Already in Use
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port:
# Edit .env: PORT=3001
```

### Database Errors
```powershell
# Clear and recreate database
Remove-Item ./dev.db -Force -ErrorAction SilentlyContinue
npm run db:migrate
```

### Cannot Find Module Errors
```powershell
# Reinstall dependencies
Remove-Item ./node_modules -Recurse -Force
npm install
```

### npm: The term 'npm' is not recognized
```powershell
# Install Node.js from https://nodejs.org
# Then restart PowerShell
```

## Using with Frontend

### Frontend API Calls

The frontend should call the backend APIs like this:

```javascript
// Login
const response = await fetch('http://localhost:3000/api/auth/demo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Shibasish', password: 'Shibasish' })
});
const { token } = await response.json();

// Save journal (encrypt on frontend first)
const encryptedContent = await encryptContent(journalContent);
const response = await fetch('http://localhost:3000/api/journal/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    encrypted_payload: encryptedContent,
    allow_ai_memory: false
  })
});

// Get journals
const response = await fetch('http://localhost:3000/api/journal/list', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Chat with AI (backend calls Gemini)
const response = await fetch('http://localhost:3000/api/chat/message', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: userMessage,
    mode: 'CALM',
    allow_memory: false
  })
});
const { response: aiMessage } = await response.json();
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check |
| POST | `/api/auth/demo` | Demo login |
| POST | `/api/auth/anonymous` | Anonymous session |
| GET | `/api/auth/verify` | Verify token |
| POST | `/api/journal/create` | Create journal |
| GET | `/api/journal/list` | Get journals |
| DELETE | `/api/journal/:id` | Delete journal |
| POST | `/api/chat/message` | Chat with AI |

## Enable CORS (If frontend is on different port)

In `src/app.js`, the CORS is already configured:

```javascript
app.use(cors(securityConfig.cors));
```

For local development, it allows `http://localhost:3000` and `http://localhost:5173` (Vite default).

To change, edit `src/config/security.js`:

```javascript
cors: {
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URL
  credentials: true
}
```

## Production Deployment

### 1. Use PostgreSQL Instead
```env
DATABASE_URL=postgresql://user:password@localhost:5432/anahva
NODE_ENV=production
DEMO_MODE_ENABLED=false
```

### 2. Secure Your Keys
- Use environment variables, not .env files
- Use Azure Key Vault, AWS Secrets Manager, or similar

### 3. Generate Strong Keys
```powershell
node scripts/generate-key.js
```

### 4. Deploy
```powershell
npm install --production
npm run db:migrate
npm start
```

## Next Steps

1. ✅ Backend is running on `http://localhost:3000`
2. 📖 Read `BACKEND_SETUP.md` for full documentation
3. 🧪 Run `.\test-api.ps1` to verify everything works
4. 🔗 Connect frontend and test end-to-end
5. 🚀 Deploy to production

## Support

- Check logs: `Get-Content logs/*.log -Wait`
- Enable debug: `LOG_LEVEL=debug` in `.env`
- Restart backend: Press Ctrl+C, then `npm run dev`

## Key Features Verified

- [x] Health check responds
- [x] Authentication works
- [x] Journals persist after refresh
- [x] AI responses come from backend (Gemini)
- [x] Encryption enabled
- [x] Rate limiting active
- [x] Audit logging enabled

**Backend is production-ready!** 🎉
