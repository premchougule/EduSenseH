# ⚡ Quick Start Guide

Get EduSenseH running in **5 minutes**!

---

## 📋 Prerequisites

- **Node.js** 18+ (get from https://nodejs.org)
- **npm** (comes with Node)
- **Git** (get from https://git-scm.com)
- API keys (get free from):
  - **Supabase** → https://supabase.com
  - **AssemblyAI** → https://www.assemblyai.com
  - **Groq** → https://console.groq.com

---

## 🚀 Installation (3 minutes)

### Step 1: Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-org/EduSenseH.git
cd EduSenseH

# Install dependencies
npm install
```

### Step 2: Get API Keys

**Supabase:**
1. Go to https://supabase.com
2. Create new project
3. Copy `Project URL` and `Anon Key`

**AssemblyAI:**
1. Go to https://www.assemblyai.com
2. Sign up → API tokens
3. Copy your API token

**Groq:**
1. Go to https://console.groq.com
2. Create API key
3. Copy the key

### Step 3: Setup .env File
```bash
# Create environment file
cp .env.example .env
```

Open `.env` and paste your keys:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_GROQ_API_KEY=gsk_...
VITE_ASSEMBLYAI_API_KEY=28a6a7d...
```

### Step 4: Start Development Server
```bash
npm run dev
```

**You should see:**
```
 VITE v7.3.1  ready in 245 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## 🎮 Quick Demo (2 minutes)

### Create Test Accounts

**Teacher Account:**
1. Open http://localhost:5173
2. Click "Register" (top right)
3. Email: `teacher@example.com`
4. Password: `Test@123`
5. Click "Register as Teacher"
6. Submit (you'll need to set role in Supabase)

**Student Account:**
1. Open http://localhost:5173 (different browser tab)
2. Click "Register"
3. Email: `student@example.com`
4. Password: `Test@123`
5. Submit normally
6. Note your roll number: `2024001`

### Start a Live Class

**Teacher (First Browser):**
1. Login as teacher
2. Click "Live" (top navigation)
3. Create new live class:
   - Topic: "Physics Chapter 5"
   - Duration: 10 minutes
4. Click "Record Audio"
5. **Speak into your microphone** → Text appears below!

**Student (Second Browser):**
1. Login as student
2. Click "Live"
3. Join the teacher's active class
4. Enter roll number: `2024001`
5. **See live transcript** in real-time!
6. Try switching language:
   - Click "📖 View in:" dropdown
   - Select "हिंदी" (Hindi)
   - Watch transcript translate!

---

## 📚 Next Steps

### Learn the Features

| Feature | Command | What to Do |
|---------|---------|-----------|
| **Raise Doubts** | Click "Student Doubts" | Ask a question during class |
| **Launch Poll** | Click "Launch Poll" | Quiz student understanding |
| **View Confusion** | Watch "CONFUSION METER" | See real-time engagement |
| **Generate Quiz** | After class: "Generate Quiz" | AI creates practice questions |
| **Get Summary** | After class: "Get Summary" | 5-bullet point summary |
| **Chat** | Click "Chat" tab | Discuss with class |
| **Resources** | Click "Resources" | Upload & search documents |

### Explore Code

```bash
# Check project structure
ls src/pages/        # Page components
ls src/components/   # UI components
ls src/lib/          # AI/API integrations
ls src/context/      # Global state
```

### Run Linter
```bash
npm run lint         # Check code style
npm run build        # Try production build
npm run preview      # Preview production build
```

---

## 🐛 Troubleshooting

### "Microphone not working"
- [ ] Check browser permissions (allow microphone)
- [ ] Try different browser (Chrome works best)
- [ ] Check if another app is using microphone
- [ ] Look for yellow error box in UI

### "Transcription not appearing"
- [ ] Check AssemblyAI API key is correct
- [ ] Check API rate limits (600 min free/month)
- [ ] Open browser console (F12) for error messages
- [ ] Try speaking louder/clearer

### "Students can't see transcript"
- [ ] Make sure teacher started recording first
- [ ] Check "TRANSCRIPTION" status (should say "Live")
- [ ] Refresh student browser tab
- [ ] Check Supabase connection (green status)

### "Translation not working"
- [ ] Verify Groq API key
- [ ] Try English translation first (no API call)
- [ ] Check network connection
- [ ] Wait >1 second for API response

### "Build fails"
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## ✅ Verify Installation

Run this command to check everything is set up:

```bash
# Check Node version
node --version        # Should be 18+

# Check npm
npm --version        # Should be 9+

# Check dependencies
npm list             # Should show all packages

# Test build
npm run build        # Should complete in <30s

# Test dev server
npm run dev          # Should start on localhost:5173
```

---

## 🎯 Common Tasks

### Change Homepage Message
Edit `src/pages/Welcome.jsx` - save and see live update!

### Add New Page
1. Create `src/pages/NewPage.jsx`
2. Import in `src/App.jsx`
3. Add route
4. Test at `http://localhost:5173/newpage`

### Access Database (Supabase)
1. Go to Supabase dashboard
2. Select your project
3. Click "SQL Editor"
4. Query your data

### Monitor Real-time Data
1. Open browser DevTools (F12)
2. Network tab
3. Look for WebSocket connections
4. Watch message flow in real-time!

---

## 🚀 Deploy to Production

### Deploy Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy Frontend (Netlify)
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for full guide.

---

## 📖 Documentation

- **README.md** - Full project overview
- **CONTRIBUTING.md** - How to contribute
- **DEPLOYMENT.md** - Production deployment
- **CHANGELOG.md** - What's new
- **docs/HACKATHON_WINNING_BLUEPRINT.md** - Architecture deep-dive

---

## 🆘 Need Help?

1. **Check [README.md](README.md)** - Comprehensive docs
2. **Search [GitHub Issues](https://github.com/your-org/EduSenseH/issues)** - Common problems
3. **Join discussions** - Ask questions
4. **Email support** - support@edusenseH.dev

---

## ⚡ Pro Tips

- **Restart dev server after .env changes** → `npm run dev`
- **Use console.log with prefixes** → `console.log('[LiveClass]', value)`
- **Test on multiple browsers** → Chrome, Firefox, Safari
- **Save often** → Vite auto-reloads (HMR)
- **Check console errors** → F12 → Console tab
- **Use React DevTools** → Chrome extension for debugging

---

## 🎉 You're Ready!

Your EduSenseH development environment is ready. Start coding! 🚀

**First time?** Follow the Quick Demo above and explore the UI.

**Ready to code?** Check [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

**Happy hacking!** 💻✨
