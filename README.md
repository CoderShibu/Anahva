# 🌸 Anahata - Wellness Companion

Anahata is a privacy-first, AI-powered mental wellness application featuring an empathetic chatbot and a secure, encrypted journal.

---

## 🚀 Quick installation

### 1. Start the Backend
Open a terminal in the `backend` folder:
```powershell
cd backend
npm install
node src/server.js
```
*You should see: `🚀 ANAHATA SERVER RUNNING ON 3000`*

### 2. Start the Frontend
Open a **new** terminal in the `Anahata` folder:
```powershell
cd Anahata
npm install
npm run dev
```
*You should see: `Local: http://localhost:5173`*

### 3. Open App
- Go to: **http://localhost:5173**
- Login: **Shibasish** / **Shibasish**

---

## ✨ Features

- **🧠 Real AI Chat**: Powered by Google Gemini 2.0 Flash. No pre-recorded responses.
- **📔 Encrypted Journal**: Your thoughts are AES-256 encrypted before saving.
- **🗑️ Data Control**: Delete individual journal entries or clear your entire history with one click.
- **🔒 Privacy First**: Your data stays on your machine (SQLite) and is never used for training.

---

## 🛠️ Troubleshooting

- **AI Not Responding?** Check your `backend/.env` file has a valid `GOOGLE_API_KEY`.
- **404/403 Errors?** The app automatically switches between Gemini models (`2.0-flash`, `2.5-flash`) to find one that works for your key.
- **Journal Not Saving?** The database (`dev.db`) is auto-created in the `backend/` folder. Ensure the backend is running.

---

**Made with 💙.**
