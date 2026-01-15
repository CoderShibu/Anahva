# 🚀 Anahva Chatbot - Quick Start Guide

## ⚡ Get Started in 60 Seconds

### Prerequisites
- Both servers running (see below)
- Modern web browser (Chrome, Firefox, Edge)

### Step 1: Start Backend
```bash
cd c:\Users\ASUS\OneDrive\Desktop\Anahata\backend
npm run dev
```
✅ Wait for: `🚀 Server running on port 3000`

### Step 2: Start Frontend (New Terminal)
```bash
cd c:\Users\ASUS\OneDrive\Desktop\Anahata\Anahata
npm run dev
```
✅ Wait for: `Local: http://localhost:5173/`

### Step 3: Open Application
Navigate to: **http://localhost:5173**

### Step 4: Login
- **Username**: `Shibasish`
- **Password**: `Shibasish`
- Click "Sign In"

### Step 5: Chat with Gemini AI
1. Click the **Chat icon** in navigation
2. Type your message
3. **Press Enter** or click **Send**
4. **Watch Anahva respond** with Gemini AI! 💬

## 📱 Main Pages

| Page | Features |
|------|----------|
| **Chat** | Real-time chat with Gemini AI |
| **Journal** | Write and store private journal entries |
| **History** | View past journals and chat history |
| **Insights** | Get patterns and insights from entries |
| **Settings** | Change language, theme, modes |

## 🎯 Try These Prompts

### For Stress Relief
"I'm feeling overwhelmed with work"

### For Late Night
"Can't sleep, my mind won't stop"

### For Reflection
"I don't know how I'm feeling"

### For Support
"I need to talk to someone"

## 🎛️ Controls

### Top Right
- **Theme Toggle**: Dark mode (only option)
- **Language Toggle**: English / Hindi

### Navigation
- **Home**: Dashboard
- **Chat**: Talk to Anahva
- **Journal**: Write private thoughts
- **History**: View past entries
- **Insights**: See patterns
- **Safe Circle**: Emergency contacts
- **Settings**: Configuration

### Chat Controls
- **Microphone**: Voice input (feature ready)
- **Input Field**: Type your message
- **Send Button**: Send message (or Press Enter)

## 🌙 Special Modes

### Night-Watch Mode
- Activated automatically after 11 PM
- Shorter, gentler responses
- Focused on listening

### Stress Mode
- Select from: Exam, Work, Internship
- Enables grounding exercises
- Calming techniques

### Confidential Mode
- Disables memory storage
- No history saved
- Maximum privacy

## 🔐 Privacy Features

✅ **Encrypted Storage**: Journal entries encrypted with AES-256-GCM
✅ **Optional Memory**: Conversations stored only if you allow
✅ **Session-based**: Data tied to your session
✅ **No Tracking**: No analytics, no profiling
✅ **Audit Logs**: You control what data is kept

## 🆘 Troubleshooting

### Chat Not Responding?
1. Check backend terminal - should show: `🚀 Server running on port 3000`
2. Refresh browser page (Ctrl+R)
3. Clear browser cache (F12 → Application → Storage → Clear All)
4. Re-login with demo credentials

### Getting "Not Found" Error?
1. Make sure you're logged in
2. Check if backend is still running
3. Try going to Chat page specifically

### Message Stuck on "Typing"?
1. Check browser console (F12)
2. Verify Google API key is in backend `.env`
3. Restart backend: `Ctrl+C` then `npm run dev`

## 📞 Quick Debug

### Check Backend Health
```
Visit: http://localhost:3000/health
Should see: {"status":"ok", ...}
```

### Check API Connection
Open browser DevTools (F12) → Network tab → Send message → See if request succeeds

### Check Authentication
F12 → Application → Cookies/Storage → Look for `authToken` in localStorage

## 🎓 Understanding Modes

```
TIME OF DAY
├─ After 11 PM: LISTEN mode (empathetic)
└─ Before 11 PM: REFLECT mode (questioning)

STRESS LEVEL
├─ Exam/Work: CALM mode (grounding)
├─ Internship: CALM mode (pressure relief)
└─ Normal: REFLECT mode (exploration)

MEMORY
├─ Allow Memory: Stores conversation context
└─ Confidential: No memory, instant privacy
```

## 🤖 How Gemini AI Works

1. **You type** a message
2. **Frontend sends** it to backend
3. **Backend authenticates** your session
4. **Gemini API** processes your message with safety constraints
5. **AI generates** empathetic, supportive response
6. **Frontend displays** response with animation
7. **Conversation** stored securely (if allowed)

## 💡 Pro Tips

- **Be Honest**: The more you share, the better Anahva understands
- **Ask Follow-ups**: "Tell me more" prompts deeper responses
- **Use Modes**: Switch modes to get different perspectives
- **Enable Memory**: Let Anahva remember context for better support
- **Late Night**: Use Night-Watch mode after 11 PM for gentle listening

## 🔗 Useful Links

- **Health Check**: http://localhost:3000/health
- **Frontend**: http://localhost:5173
- **API Docs**: See GEMINI_AI_CHATBOT_GUIDE.md

## ⏱️ What to Expect

| Action | Expected Time |
|--------|---|
| Login | < 1 second |
| First message | 2-5 seconds (API call) |
| Subsequent messages | 2-5 seconds each |
| Response display | Instant animation |

## 🎯 Next Steps

1. ✅ Get both servers running
2. ✅ Login with demo credentials
3. ✅ Navigate to Chat page
4. ✅ Send your first message
5. ✅ See Gemini AI respond!
6. ✅ Try different modes
7. ✅ Explore other features

## 📊 Feature Status

- ✅ Real-time Gemini AI chat
- ✅ Three response modes
- ✅ Stress detection
- ✅ Night-Watch mode
- ✅ Encrypted journal
- ✅ Privacy features
- ✅ Dark theme only
- ✅ Dark mode-only theme
- ✅ Bilingual (EN/HI)
- ✅ Security & safety

---

**Ready to chat? Let's go!** 🚀💜

**Support Email**: (Add your support info)
**Last Updated**: 11/01/2026
