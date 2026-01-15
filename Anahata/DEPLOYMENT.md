# Local Deployment Guide - Anahva

## Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Open your browser and navigate to:
**http://localhost:5173**

## Login Information

To access the application:
- **Username:** `Shibasish`
- **Password:** `Shibasish`

## Showcasing the Application

### Main Features to Demonstrate:

1. **Login Page**
   - Beautiful animated heart orb
   - Language toggle (EN/हिंदी)
   - Dark theme by default

2. **Home Dashboard**
   - Personalized greeting
   - Quick action buttons
   - Navigation sidebar (desktop) or bottom nav (mobile)

3. **Journal**
   - Writing prompts
   - Auto-save functionality
   - Voice journal option

4. **Chat with Anahva**
   - AI companion interface
   - Empathetic responses
   - Real-time typing indicators

5. **Insights**
   - Weekly mood chart
   - Personalized insights
   - Privacy notice

6. **Safe Circle**
   - Grounding exercises
   - Support tiers
   - Breathing animations

7. **Settings**
   - Theme toggle (Dark/Light)
   - Language selection
   - User profile

### Theme Switching
- Click the theme toggle in the sidebar (desktop) or Settings page
- Watch the smooth transition between dark and light themes
- Theme preference is saved automatically

### Language Switching
- Toggle between English and Hindi
- All UI text updates instantly
- Available on login page and settings

## Production Build

To create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` folder.

To preview the production build:
```bash
npm run preview
```

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically try the next available port. Check the terminal output for the actual URL.

### Module Not Found Errors
Run `npm install` again to ensure all dependencies are installed.

### Browser Not Loading
1. Check that the dev server is running (look for "Local: http://localhost:5173" in terminal)
2. Try clearing browser cache
3. Check browser console for errors (F12)

## Network Access

To access from other devices on your network:
1. The terminal will show a "Network" URL when the server starts
2. Make sure your firewall allows connections on the port
3. Access from other devices using your computer's IP address

## Performance Tips

- The app uses code splitting for optimal performance
- Images and assets are optimized automatically
- Hot Module Replacement (HMR) for instant updates during development

