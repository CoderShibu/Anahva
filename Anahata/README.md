# Anahata Frontend - Mental Wellness Sanctuary

The React frontend for the Anahata mental wellness platform.

## 🌟 Features

- 🌙 **Dark & Light Themes** - Toggle between beautiful dark and light themes
- 🌍 **Multi-language Support** - English and Hindi (हिंदी)
- 📝 **AI-Powered Journaling** - Write journal entries that persist to backend database
- 💬 **Empathetic Chat Companion** - Talk to Anahva AI powered by Google Gemini
- 📊 **Insights & Analytics** - Track your emotional journey over time
- 🛡️ **Safe Circle** - Access grounding exercises and support resources
- 🔒 **Privacy First** - All sensitive data encrypted

## 🏗️ Architecture

This is the **frontend** of a full-stack application:

### Frontend (This Directory)
- **Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Port**: 5173 (Vite default)
- **Location**: `/Anahata/` directory

### Backend (Required to Run)
- **Location**: `/backend/` directory (parent folder)
- **Port**: 3000
- **Tech**: Node.js, Express, Prisma, SQLite, Google Gemini AI
- **Must be running** for login, journal saving, and AI chat to work

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** installed
- **Backend server** must be running (see ../backend/WINDOWS_QUICKSTART.md)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:
- **Local:** http://localhost:5173

**⚠️ IMPORTANT**: The backend must be running on port 3000 for full functionality!

## 🔑 Login Credentials

**Demo Account:**
- Username: `Shibasish`
- Password: `Shibasish`

## 📁 Project Structure

```
Anahata/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Navigation.tsx
│   │   ├── ui/          # Shadcn UI components
│   │   └── ...
│   ├── contexts/        # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── LanguageContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ...
│   ├── pages/           # Page components
│   │   ├── Chat.tsx         # AI chatbot interface
│   │   ├── Journal.tsx      # Journal writing
│   │   ├── Login.tsx
│   │   ├── Insights.tsx
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   │   ├── use-toast.ts
│   │   └── use-mobile.tsx
│   ├── lib/             # Utility functions
│   │   ├── api.ts           # Backend API client
│   │   ├── encryption.ts
│   │   └── utils.ts
│   ├── utils/
│   │   └── regionalContext.ts  # Fallback responses
│   └── index.css        # Global styles and theme variables
├── public/              # Static assets
└── vite.config.ts       # Vite configuration
```

## 🔌 Backend Integration

### API Client (`src/lib/api.ts`)

The frontend connects to the backend at `http://localhost:3000/api`:

```typescript
// Authentication
authAPI.demoLogin(name, password)        // Returns JWT token
authAPI.verifySession()                   // Validates token
authAPI.logout()                          // Ends session

// Journal (requires auth)
journalAPI.create(content, allowAIMemory)  // Saves to database
journalAPI.list(limit, offset)             // Retrieves journals
journalAPI.delete(id)                      // Deletes journal

// Chat (requires auth)
chatAPI.sendMessage(message, mode, allowMemory)  // AI responds via Gemini
chatAPI.getSession()                             // Get chat metadata
chatAPI.updateMode(mode)                         // Change mode
```

### Chat Modes

- **LISTEN** - Empathetic listening
- **REFLECT** - Guided self-reflection  
- **CALM** - Grounding and calming techniques

### Fallback Behavior

If backend is unavailable:
- **Journal**: Shows error, won't save
- **Chat**: Falls back to `regionalContext.ts` pre-programmed responses
- **Login**: Won't work

## 🎨 Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **TanStack Query** - Data fetching (if used)
- **Radix UI** - Accessible components
- **Lucide React** - Icons

## 🌈 Theme System

The app supports both dark and light themes:
- Toggle theme from Navigation sidebar (desktop) or Settings page
- Theme preference saved to localStorage
- Smooth transitions between themes

## 🌍 Language Support

Currently supports:
- English (EN)
- Hindi (हिंदी)

Toggle language from top-right corner on login or from Settings.

## 📝 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Development Workflow

1. **Start backend first**:
   ```bash
   cd ../backend
   npm run dev
   ```

2. **Then start frontend** (in new terminal):
   ```bash
   cd Anahata
   npm run dev
   ```

3. **Open browser**: http://localhost:5173

4. **Login** with demo credentials

5. **Test features**:
   - Write journal → Check it persists after refresh
   - Chat with AI → Should get contextual responses
   - Check Network tab → See API calls to localhost:3000

## 🔧 Configuration

### Update API URL

By default, frontend connects to `http://localhost:3000/api`.

To change this (for production):

1. Create `.env.local` in this directory:
   ```env
   VITE_API_URL=https://your-backend.com/api
   ```

2. Or edit `src/lib/api.ts`:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
   ```

## 🧪 Testing

### Manual Testing Flow

1. **Health Check**: Backend running?
   - Open: http://localhost:3000/health
   - Should see: `{"status":"ok",...}`

2. **Login Test**:
   - Username: Shibasish
   - Password: Shibasish
   - Should redirect to Home page

3. **Journal Test**:
   - Navigate to Journal
   - Write something and wait 2 seconds (auto-save)
   - Refresh page (F5)
   - Journal should still be there! ← **Proves backend persistence**

4. **Chat Test**:
   - Navigate to Chat
   - Type: "I'm feeling stressed"
   - Should get AI-generated response (different each time)
   - ❌ Should NOT see generic "TYSM" response
   - ✅ Should see contextual emotional support

## 🐛 Troubleshooting

### "Network Error" when logging in

**Problem**: Frontend can't reach backend  
**Fix**: 
1. Check backend is running: http://localhost:3000/health
2. Check CORS settings in backend allow localhost:5173
3. Check no firewall blocking port 3000

### Chat gives generic responses

**Problem**: Backend might not be calling Gemini API  
**Possible Causes**:
1. Backend not running (falls back to `regionalContext.ts`)
2. Google API quota exceeded (backend falls back gracefully)
3. No `GOOGLE_API_KEY` in backend `.env`

**How to verify**: Check backend terminal logs for "✅ Google Gemini AI initialized"

### Journal not saving

**Problem**: Database not persisting  
**Fix**:
1. Verify backend running
2. Check you're logged in (JWT token exists)
3. Open Network tab → See `POST /api/journal/create` call?
4. Check backend logs for errors

### Stuck on login page after entering credentials

**Problem**: Auth API not responding  
**Fix**:
1. Backend must be running on port 3000
2. Demo mode enabled in backend `.env`: `DEMO_MODE_ENABLED=true`
3. Check browser console for errors
4. Check backend terminal for incoming requests

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 📦 Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

Output: `dist/` folder containing optimized static files

Deploy `dist/` to:
- Vercel
- Netlify  
- Cloudflare Pages
- Any static hosting

**Remember**: Update `VITE_API_URL` to point to production backend!

## 🔗 Related Documentation

- **Main Project README**: `/README.md` (parent directory)
- **Backend Setup**: `/backend/BACKEND_SETUP.md`
- **Backend Quick Start**: `/backend/WINDOWS_QUICKSTART.md`

## 📄 License

Private project - All rights reserved

---

**Note**: This frontend requires the backend server to function fully. See `/backend/WINDOWS_QUICKSTART.md` for backend setup instructions.
