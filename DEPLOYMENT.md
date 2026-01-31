# 🚀 eeployment Guide: Anahata

This guide explains how to deploy the Anahata project so it runs 24/7 on the internet.

Since this app uses **SQLite** (a file-based database), you need a hosting provider that supports **Persistent Storage** (a real hard drive).
**Recommended Providers:** DigitalOcean Droplet ($4/mo), AWS EC2, Hetzner, or Railway.app (with volume).
**Avoid:** Vercel/Netlify (They are serverless and will delete your database every day).

---

## 📦 Strategy: The "All-in-One" Build
Instead of running two separate terminals (Frontend + Backend), we will "build" the Frontend into static HTML/JS files and have the Backend serve them. This means you only need to run **one** server.

### Step 1: Prepare the Frontend
1. On your local machine, open terminal in `Anahata/` folder.
2. Run: `npm run build`
3. This creates a `dist/` folder. This folder contains your entire website optimized for production.

### Step 2: Move to Backend
1. Create a folder named `public` inside your `backend/` folder.
2. Copy **everything** inside `Anahata/dist/` into `backend/public/`.
   - Result: `backend/public/index.html` should exist.

### Step 3: Update `server.js` (One Time Code Change)
You need to tell the backend to serve these files. Add this code to `backend/src/server.js` right before `app.listen`:

```javascript
// ... existing code ...

// SERVE FRONTEND (Add this section)
app.use(express.static(join(__dirname, '../public')));
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../public', 'index.html'));
});

app.listen(PORT, ...);
```
*(Now, `node src/server.js` runs BOTH the API and the Website on port 3000!)*

---

## ☁️ Option A: Deploy to a Linux VPS (DigitalOcean/AWS/Ubuntu)
*Best for control and persistence.*

### 1. Get a Server
- Rent an Ubuntu 22.04 server.
- SSH into it: `ssh root@your-server-ip`

### 2. Install Node.js
Run these commands on the server:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2  # PM2 keeps your app running forever
```

### 3. Upload Your Code
You can use Git/GitHub (recommended) or SCP.
**Using SCP (easiest without Git):**
On your local machine:
```powershell
# Copy the backend folder (which now contains the built frontend in /public)
scp -r d:\Anahata\backend root@your-server-ip:/var/www/anahata
```

### 4. Configure & Start
On the server:
```bash
cd /var/www/anahata

# Install dependencies
npm install

# Setup Environment Variables
nano .env
# Paste:
# PORT=80
# GOOGLE_API_KEY=your_key_here
# (Press Ctrl+X, Y, Enter to save)

# Start with PM2 (Background Process Manager)
pm2 start src/server.js --name anahata
pm2 save
pm2 startup
```

### 5. Done!
Visit `http://your-server-ip`. Your app is live!

---

## 🚂 Option B: Render.com / Railway
*Easier, no command line.*

1. **GitHub**: Push your `backend` folder to a GitHub repository.
   - *Make sure you included the `public/` folder with the built frontend!*
2. **Create Web Service**: Connect your repo.
3. **Build Command**: `npm install`
4. **Start Command**: `node src/server.js`
5. **Environment Variables**: Add `GOOGLE_API_KEY`.
6. **Persistent Disk (Crucial!)**:
   - Mount disk path: `/opt/render/project/src/backend` (or wherever Render puts your app)
   - If you don't do this, `dev.db` might reset on restarts.

---

## 🔄 Maintenance

- **View Logs (VPS)**: `pm2 logs anahata`
- **Restart (VPS)**: `pm2 restart anahata`
- **Update Website**:
  1. `npm run build` locally.
  2. Upload new contents of `dist/` to server's `backend/public/`.
