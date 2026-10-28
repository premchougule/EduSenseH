# Deployment Guide for EduSenseH

This guide covers deploying EduSenseH to production environments.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Frontend)
Fastest, easiest, perfect for React + Vite apps.

#### Setup
1. **Create Vercel account** at https://vercel.com
2. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```
3. **Link project**
   ```bash
   vercel link
   ```
4. **Set environment variables** in Vercel dashboard
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_GROQ_API_KEY
   VITE_ASSEMBLYAI_API_KEY
   ```
5. **Deploy**
   ```bash
   vercel --prod
   ```

**Pros:**
- ✅ Automatic deployments on push
- ✅ Free tier for projects
- ✅ CDN included
- ✅ Serverless functions available
- ✅ Analytics, logs, monitoring

**Cons:**
- Requires paid plan for increased limits

#### Continuous Deployment
1. Push code to GitHub
2. Vercel automatically deploys on merge to `main`
3. Preview deployments for pull requests

### Option 2: Netlify
Similar to Vercel, good alternative.

#### Setup
1. **Connect GitHub repo** at https://netlify.com
2. **Build settings**:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
3. **Add environment variables** in Netlify UI
4. **Deploy** - Automatic on push!

### Option 3: Docker + Self-hosted (Advanced)

#### Create Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "-l", "3000", "dist"]
```

#### Build & Deploy
```bash
# Build image
docker build -t edusenseH:latest .

# Run locally
docker run -p 3000:3000 edusenseH:latest

# Push to Docker Hub
docker tag edusenseH:latest your-username/edusenseH:latest
docker push your-username/edusenseH:latest

# Deploy to AWS ECS, Google Cloud, etc.
```

### Option 4: GCP Cloud Run
Serverless container deployment.

```bash
# Install Google Cloud CLI
gcloud init

# Build & deploy
gcloud run deploy edusenseH \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 📋 Pre-deployment Checklist

- [ ] All tests passing locally
- [ ] ESLint checks pass: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No console.logs in production code
- [ ] Environment variables configured
- [ ] API rate limits documented
- [ ] HTTPS enabled (required for audio)
- [ ] CORS headers configured (if needed)
- [ ] Database backups scheduled
- [ ] Error monitoring set up (Sentry, etc.)

---

## 🔒 Security for Production

### Environment Variables
**Never commit these!** Store in deployment platform:
```bash
# .env (local only, NOT in git)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_GROQ_API_KEY=...
VITE_ASSEMBLYAI_API_KEY=...
```

Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

### Supabase Security
1. **Enable RLS** on all tables
2. **Use policies** for row-level access
3. **Restrict API keys** - anon key for frontend only
4. **Enable audit logs** for compliance
5. **Set up backups** - Daily automatic or manual

### API Rate Limiting
- **Groq**: Free tier ~100 req/min
- **AssemblyAI**: Free tier 600 min/month
- **Supabase**: Pay-as-you-go with limits

Monitor usage:
- Groq dashboard: https://console.groq.com
- AssemblyAI: https://www.assemblyai.com/dashboard
- Supabase: Dashboard → Usage

### CORS & HTTPS
- Production must use HTTPS
- Update Supabase CORS allowed origins
- Audio capture requires secure context

---

## 📊 Monitoring & Logging

### Sentry (Error Tracking)
```javascript
// Install
npm install @sentry/react

// Initialize (main.jsx)
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: "YOUR_DSN" });

// App.jsx
Sentry.withProfiler(App);
```

### Google Analytics
```javascript
// Install
npm install react-ga4

// Initialize (main.jsx)
import ReactGA from "react-ga4";
ReactGA.initialize("G-YOUR_MEASUREMENT_ID");

// Track page views
useEffect(() => {
  ReactGA.send(pageview);
}, [location]);
```

### Supabase Logs
```bash
# View logs
supabase logs --project-id=your-project-id

# Tail logs
supabase logs --project-id=your-project-id --tail
```

---

## 🔄 Deployment Workflow

### Development
```bash
git checkout -b feature/my-feature
# Make changes...
npm run lint
npm run dev
git add .
git commit -m "feat: my feature"
```

### Testing
```bash
# Manual testing
npm run dev

# Production build
npm run build
npm run preview
```

### Push & Review
```bash
git push origin feature/my-feature
# Create Pull Request on GitHub
# Wait for CI checks & review
```

### Merge & Deploy
```bash
git checkout main
git pull origin main
# PR merged automatically
# Vercel/Netlify builds & deploys automatically
```

### Post-deployment
1. Verify production endpoint works
2. Check API responses
3. Monitor error logs
4. Monitor performance metrics

---

## 🆘 Troubleshooting

### Transcription Not Working
**Error:** "WebSocket connection failed"
- [ ] Verify HTTPS enabled (audio requires secure)
- [ ] Check AssemblyAI API key valid
- [ ] Check API rate limits not exceeded
- [ ] Check browser permissions (allow microphone)

### Translation Errors
**Error:** "Translation timeout"
- [ ] Verify Groq API key active
- [ ] Check rate limits in Groq dashboard
- [ ] Try shorter transcript for testing
- [ ] Check internet connection speed

### Slow Performance
**Problem:** App loading slowly
- [ ] Check CDN is delivering assets
- [ ] Check database query performance
- [ ] Monitor API response times
- [ ] Use Chrome DevTools Lighthouse report

**Fix:**
```bash
# Analyze bundle size
npm install -g webpack-bundle-analyzer
npm run build
webpack-bundle-analyzer dist/
```

### Database Issues
**Error:** "Connection timeout"
- [ ] Check Supabase status: https://status.supabase.com
- [ ] Verify connection string in environment
- [ ] Check network firewall rules
- [ ] Restart pooler if available

---

## 💰 Cost Estimation

### Monthly Costs (Estimated)
| Service | Free Tier | Cost | Notes |
|---------|-----------|------|-------|
| **Frontend CDN** | Yes | $0-20 | Vercel/Netlify |
| **Supabase Database** | 500MB | $25+ | Pay as you grow |
| **AssemblyAI STT** | 600 min | $0.10/min | ~$3 for 100 min |
| **Groq API** | Yes (shared) | $0 | Rate limited |
| **Total Estimate** | - | **$0-60** | Small to medium class |

### For Scaling
- **100 concurrent users**: +$10-20 infrastructure
- **1000 daily users**: +$50-100 infrastructure
- **Production SLA**: +$200+ for premium support

---

## 🎯 Optimization Tips

### Build Size
```bash
# Analyze bundle
npm run build
# dist/ folder should be < 500KB (gzipped)

# Move unused packages to devDependencies
npm uninstall package-name
npm install --save-dev package-name
```

### Runtime Performance
```javascript
// Lazy load routes
const LiveClass = lazy(() => import('./pages/LiveClass'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Debounce translation requests
const debouncedTranslate = useCallback(
  debounce(async (text, lang) => {
    const result = await translate(text, lang);
    setTranscript(result);
  }, 500),
  []
);

// Batch database writes
const batchWrite = async (rows) => {
  const chunks = chunk(rows, 50);
  for (const batch of chunks) {
    await supabase.from('transcripts').insert(batch);
  }
};
```

### Database Performance
```sql
-- Add indexes for common queries
CREATE INDEX idx_sessions_user_id ON live_sessions(created_by);
CREATE INDEX idx_transcripts_session_id ON transcript_chunks(session_id);
CREATE INDEX idx_transcripts_created_at ON transcript_chunks(created_at);

-- Enable realtime only where needed
ALTER publication supabase_realtime ADD TABLE live_sessions;
ALTER publication supabase_realtime ADD TABLE transcript_chunks;
```

---

## 📞 Support & Troubleshooting

### Common Issues & Solutions

**Issue: Transcription blank**
- Check microphone permissions
- Test with browser's audio settings
- Verify AssemblyAI key and rate limits
- Check browser console for errors

**Issue: Slow translations**
- Reduce transcript length for testing
- Check Groq API status & limits
- Increase debounce timeout
- Pre-translate common phrases

**Issue: Database full**
- Implement data archival (move old sessions)
- Clean up temporary data
- Upgrade Supabase storage plan
- Implement retention policies

---

## 📚 Resources

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Supabase Deployment](https://supabase.com/docs/guides/platform)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)

---

## ✅ Deployment Checklist

- [ ] Code merged to main
- [ ] All tests passing
- [ ] Environment variables set in production
- [ ] API keys verified valid
- [ ] Database migrations run
- [ ] HTTPS enabled
- [ ] Monitoring/logging configured
- [ ] Backups scheduled
- [ ] Documentation updated
- [ ] Team notified of deployment
- [ ] Smoke tests pass in production
- [ ] Performance baseline documented

---

Happy deploying! 🚀
