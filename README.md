# Solo Leveling RPG — Gamified Self-Improvement System

A gamified self-improvement and habit-tracking progressive web app (PWA) inspired by Solo Leveling. Turn daily habits into RPG stats, conquer weekly dungeon bosses, level up Hunter ranks, and maintain life balance across academics, fitness, faith, and skills.

---

## 🚀 One-Click GitHub Pages Hosting

This repository is pre-configured with **zero-configuration GitHub Pages deployment** via GitHub Actions:

### Step-by-Step Setup:
1. Push this repository to GitHub (or create a new GitHub repository and push your code).
2. Go to your repository on GitHub.
3. Click on **Settings** $\rightarrow$ **Pages** (in the left sidebar).
4. Under **Build and deployment**:
   - Change **Source** to **GitHub Actions**.
5. Push any commit to `main` (or run the workflow manually from the **Actions** tab).
6. Your application will be live at `https://<your-username>.github.io/<your-repo-name>/`.

---

## 🛠️ Local Development & Manual Build

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (binds to http://localhost:3000)
npm run dev

# 3. Compile for production
npm run build

# 4. Preview compiled production bundle locally
npm run preview
```

The production output is generated in the `dist/` directory and can be hosted on:
- **GitHub Pages**
- **Vercel**
- **Netlify**
- **Cloudflare Pages**
- Any static hosting server or CDN

---

## 📱 Android & Desktop PWA Installation
- **Offline Support**: Caches application assets, fonts, and icons automatically with Workbox.
- **Standalone Android HUD**: Seamless fullscreen display with custom status bars and adaptive launcher icons.
- **Chrome / Android**: Tap the **Install App** button or open the 3-dot browser menu and select **"Add to Home screen"** / **"Install app"**.

---

## 🛡️ Architecture & Data Safety
- **100% Client-Side & Zero-Cost**: Requires no backend server or paid database; all character attributes, streak counts, logs, and achievements are securely preserved in client-side storage (`localStorage`).
- **Data Portability**: Easily backup your full state via **Settings $\rightarrow$ Export JSON** or restore it anytime.
