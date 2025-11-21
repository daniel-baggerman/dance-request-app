# Development Environment Setup Guide

## Prerequisites (One-Time Installation)

### 1. Install Node.js
- Download from: https://nodejs.org/
- Install version 18 or higher (LTS recommended)
- Verify installation:
  ```powershell
  node --version
  npm --version
  ```

### 2. Install Firebase CLI
```powershell
npm install -g firebase-tools
```
- Verify installation:
  ```powershell
  firebase --version
  ```

### 3. Code Editor
- VS Code (recommended): https://code.visualstudio.com/
- Install Vue extensions (optional but helpful):
  - Volar (Vue Language Features)
  - Vue VSCode Snippets

---

## Project Setup (Do These Steps)

### Step 1: Create Vue Project with Vite
Navigate to your workspace folder, then:
```powershell
cd "c:\Users\dbaggerman\OneDrive - PowerPlan\Line Dance App"
npm create vite@latest dance-request-app -- --template vue
```
- This creates a new `dance-request-app` folder with Vue + Vite

### Step 2: Install Dependencies
```powershell
cd dance-request-app
npm install
```

### Step 3: Install Firebase
```powershell
npm install firebase
```

### Step 4: Install Tailwind CSS (Optional - for styling)
```powershell
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

If you install Tailwind, update these files:

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**src/style.css** (replace existing content):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 5: Test the Dev Server
```powershell
npm run dev
```
- Should open at `http://localhost:5173`
- You should see the default Vite + Vue welcome page
- Press `Ctrl+C` to stop the server

---

## Firebase Setup

### Step 6: Create Firebase Project
1. Go to: https://console.firebase.google.com/
2. Click "Add project" or "Create a project"
3. Name it: `dance-request-app` (or your preferred name)
4. Disable Google Analytics (not needed for this project)
5. Click "Create Project"

### Step 7: Add Web App to Firebase
1. In your Firebase project, click the web icon `</>`
2. Register app with nickname: `dance-request-web`
3. Don't enable Firebase Hosting yet (we'll do that later)
4. Copy the Firebase configuration object (you'll need this next)

### Step 8: Configure Firebase in Your App
Create file: `src/firebase/config.js`

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Paste your Firebase config here (from Step 7)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### Step 9: Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (we'll add security rules later)
4. Choose location (us-central or closest to you)
5. Click "Enable"

### Step 10: Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Click "Email/Password" under Sign-in method
4. Enable "Email/Password" (first toggle only, not passwordless)
5. Click "Save"

---

## Initialize Firebase Hosting (Optional - Do Later)

When ready to deploy, run:
```powershell
firebase login
firebase init hosting
```
- Select your Firebase project
- Set public directory to: `dist`
- Configure as single-page app: Yes
- Set up automatic builds with GitHub: No (for now)

---

## Verify Everything Works

### Final Check:
```powershell
cd dance-request-app
npm run dev
```

You should have:
- ✅ Vue + Vite app running on localhost
- ✅ Firebase SDK installed
- ✅ Firebase project created with Firestore + Auth enabled
- ✅ Firebase config file in your project

---

## What's Next?

Once setup is complete, you're ready to:
1. Create Vue components for the UI
2. Build mockups with placeholder data
3. Connect to Firebase for real-time functionality
4. Test and iterate

---

## Troubleshooting

**"npm command not found"**
- Node.js not installed or not in PATH
- Restart terminal after installing Node.js

**"firebase command not found"**
- Firebase CLI not installed globally
- Run: `npm install -g firebase-tools`

**Vite dev server won't start**
- Port 5173 might be in use
- Try: `npm run dev -- --port 3000`

**Import errors with Firebase**
- Make sure you ran `npm install firebase`
- Check that config.js has correct imports
