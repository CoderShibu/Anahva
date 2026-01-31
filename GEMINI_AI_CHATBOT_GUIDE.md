# Anahva - Gemini AI Chatbot Integration Guide

## ✅ System Status

Your Anahva mental wellness chatbot is now fully integrated with **Google Gemini AI** and is ready to use!

## 🚀 How It Works

### Architecture Flow

```
Frontend (React) 
    ↓ (User Message)
API (/api/chat/message)
    ↓
Backend (Node.js + Express)
    ↓
Gemini AI Service
    ↓ (AI Response)
Frontend (React) - Display Response
```

### Real-time Chat Features

1. **Instant Responses**: Uses Google Gemini API for real-time intelligent responses
2. **Three Modes**:
   - **LISTEN**: Empathetic listening with gentle open-ended questions
   - **REFLECT**: Socratic questioning for self-discovery
   - **CALM**: Grounding and calming techniques

3. **Context-Aware**:
   - Detects stress mode (exam, work, internship)
   - Adjusts for night-time conversations (11 PM+)
   - Remembers conversation context (with permission)

4. **Safety First**:
   - NO medical diagnosis
   - NO medical advice
   - NO harmful content
   - Supportive and empathetic only

## 🔐 Authentication

### Demo Login Credentials
```
Username: Shibasish
Password: Shibasish
```

### Login Flow
1. Navigate to http://localhost:5173
2. Click "Sign In"
3. Enter credentials: `Shibasish` / `Shibasish`
4. Click "Sign In"
5. You'll be authenticated and can use the chat

## 💬 Using the Chatbot

### Step-by-Step

1. **Login** with demo credentials
2. **Navigate to Chat** (click the chat icon in navigation)
3. **Type your message** in the input field
4. **Press Enter** or click Send button
5. **See Gemini AI response** in real-time

### Example Conversations

#### Exam Stress Mode
- **You**: "I have a big exam tomorrow"
- **Anahva (CALM mode)**: "I know exams can feel overwhelming. Let's ground you. Take a deep breath. You're prepared for this. What's one thing you've studied that you feel confident about?"

#### Late Night (Night-Watch Mode)
- **You**: "Can't sleep, feeling anxious"
- **Anahva (LISTEN mode)**: "Late nights can amplify our worries. I'm here. What's on your mind right now? No need to solve anything, just share."

#### General Reflection
- **You**: "Feeling overwhelmed with work"
- **Anahva (REFLECT mode)**: "That's a lot to carry. What part of work feels most overwhelming? When did you first notice this feeling?"

## 🎯 Features

### Modes

**LISTEN Mode** (Default for Night-Watch)
- Empathetic listening
- Open-ended questions
- Validation of emotions
- No problem-solving

**REFLECT Mode** (Default for regular hours)
- Socratic questioning
- Self-discovery guidance
- Pattern exploration
- Personal insights

**CALM Mode** (Default for Stress Mode)
- Grounding techniques
- Breathing exercises
- Mindfulness prompts
- Shorter, soothing responses

### Response Customization

The AI adjusts responses based on:
- **Time of Day**: Shorter, gentler responses after 11 PM
- **User Mode**: Different prompts for different contexts
- **Language**: Responds in English or Hindi (based on language setting)
- **Memory Permission**: Stores context if allowed

## 🔧 API Endpoint

### POST /api/chat/message

**Request**:
```json
{
  "message": "I'm feeling anxious",
  "mode": "CALM",
  "allow_memory": true
}
```

**Response**:
```json
{
  "success": true,
  "response": "Take a deep breath. You're safe. What's one thing you can do right now to ground yourself?",
  "mode": "CALM",
  "safety": {
    "tier": "normal",
    "needsGrounding": false
  }
}
```

## 📊 Gemini AI Configuration

### Model Used
- **Google Gemini Pro** (via @google/generative-ai)

### Safety Settings
- All harm categories set to BLOCK_NONE (AI handles safety through prompting)
- Focus on supportive, non-directive responses

### Temperature & Tokens
- **Normal hours**: 300 max tokens, 0.8 temperature
- **Late night**: 150 max tokens, 0.7 temperature
- **Stress mode**: 300 max tokens, 0.7 temperature

## 📝 Configuration

### Backend .env Variables
```env
GOOGLE_API_KEY=AIzaSyCBKYEr33WA59RJpQBMX_508s-GhxuVxLY
DEMO_MODE_ENABLED=true
DEMO_USERNAME=Shibasish
DEMO_PASSWORD=Shibasish
```

### Frontend Environment (if needed)
```env
VITE_API_URL=http://localhost:3000/api
```

## 🐛 Troubleshooting

### Chat Not Working?

1. **Check Backend is Running**
   ```
   GET http://localhost:3000/health
   ```
   Should return: `{"status":"ok", ...}`

2. **Verify Authentication**
   - Open browser DevTools (F12)
   - Check if `authToken` is in localStorage
   - If not, re-login

3. **Check Gemini API Key**
   - Backend logs should show: `✅ Database connected`
   - If no API key error, it's working

4. **Test API Directly**
   ```bash
   curl -X POST http://localhost:3000/api/chat/message \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"message":"Hello","mode":"LISTEN","allow_memory":false}'
   ```

### Still Not Working?

Check the backend logs for errors:
- Gemini API errors will show in console
- Authentication errors show as 401
- Database errors show in Prisma queries

## 🌟 Best Practices

1. **Be Honest**: Share what you're really feeling
2. **Engage Deeply**: Use follow-up messages to dive deeper
3. **Take Your Time**: There's no rush in the conversation
4. **Respect Privacy**: Use Confidential Mode when needed
5. **Use Night-Watch Mode**: When chatting late at night

## 📱 Modes Explained

### Stress Mode Selection
```
Exam → CALM mode (grounding, breathing)
Work/Internship → CALM mode (pressure relief)
Night (11 PM+) → LISTEN mode (gentle listening)
Regular → REFLECT mode (self-exploration)
```

## ✨ What Makes It Special

✅ **Real AI**: Uses Google Gemini AI, not fake responses
✅ **Private**: Encrypted storage, optional memory
✅ **Contextual**: Understands time, mood, stress levels
✅ **Safe**: No diagnoses, no medical advice
✅ **Responsive**: Instant answers, real-time chat
✅ **Supportive**: Empathetic and non-judgmental
✅ **Bilingual**: Works in English and Hindi

## 🔗 Testing the System

### Quick Test
1. Login with `Shibasish` / `Shibasish`
2. Go to Chat page
3. Type: "I'm feeling stressed about work"
4. Watch Anahva respond with Gemini AI in real-time!

### Full Feature Test
1. Try different times (day vs night)
2. Enable/disable Confidential Mode
3. Switch Stress Mode on/off
4. Change language to Hindi
5. See responses adapt!

## 📞 Support

If the chatbot doesn't respond:
1. Check backend is running: `npm run dev` in `/backend`
2. Check frontend is running: `npm run dev` in `/Anahata`
3. Check browser console (F12) for errors
4. Verify Google API key is set in backend `.env`

---

**Anahva is ready to listen. Start chatting!** 💜
