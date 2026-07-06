# 🚀 Complete Setup & Deployment Guide

## Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Gemini API key (free from Google AI)

### Steps

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Get Your Gemini API Key
1. Go to: https://ai.google.dev/
2. Click **"Get API Key"** button
3. Create a new project or select existing
4. Copy your API key
5. Open `.env` file and add:
```
GEMINI_API_KEY="your-api-key-here"
```

#### 3. Start Development Server
```bash
npm run dev
```

#### 4. Open in Browser
```
http://localhost:3000
```

#### 5. Test the Chat
- Click the purple chat bubble in the corner
- Ask: "What is PV7-Provahan?"
- You should see streaming AI response

---

## 📋 Complete Setup Instructions

### Phase 1: Project Setup

#### 1.1 Clone/Extract Project
```bash
cd yellow-page\ \(2\)
```

#### 1.2 Install All Dependencies
```bash
npm install
```

**What gets installed:**
- React 18 (Frontend framework)
- Express.js (Backend server)
- Vite (Build tool)
- Google Generative AI SDK
- Tailwind CSS (Styling)
- PDF parsing libraries
- Animation libraries

#### 1.3 Verify Installation
```bash
npm list | grep genai
npm list | grep express
npm list | grep react
```

---

### Phase 2: Configuration

#### 2.1 Gemini API Key Setup

**Option A: Free Personal Use**
1. Visit https://ai.google.dev/
2. Click **"Get API Key"**
3. Click **"Create API Key in new project"**
4. Copy the generated key
5. Edit `.env` and replace empty value:
```bash
GEMINI_API_KEY="AIzaSyD..." # Your actual key
```

**Option B: Production (Google Cloud)**
1. Set up Google Cloud Project
2. Enable Gemini API
3. Create service account
4. Download JSON key
5. Set environment variable:
```bash
export GEMINI_API_KEY=$(cat /path/to/key.json | jq -r '.private_key')
```

**Option C: Docker/Container**
```bash
docker run -e GEMINI_API_KEY="your-key" -p 3000:3000 pv7-portal
```

#### 2.2 Verify Configuration
```bash
# Check if .env is properly formatted
cat .env

# Should output:
# GEMINI_API_KEY="AIzaSyD..."
# APP_URL="http://localhost:3000"
# PORT=3000
```

---

### Phase 3: Development

#### 3.1 Start Development Server
```bash
npm run dev
```

**Expected Output:**
```
[Startup] Found primary knowledge base PDF at: /.../PV7-Provahan Knowledge Base.pdf
[Startup] Initializing Vector Store...
[VectorStore] Cache match found for PV7-Provahan Knowledge Base.pdf. Loading embeddings from cache...
[VectorStore] Loaded 50 chunks from cache successfully.
[Startup] Vector Store initialized successfully.
[Startup] Running in DEVELOPMENT mode. Loading Vite...
[Startup] Full-stack application running at: http://localhost:3000
```

#### 3.2 Open Application
```
Browser: http://localhost:3000
```

#### 3.3 Test Features

**Test 1: Navigation**
- Press ← → arrow keys to switch pages
- Yellow → White → Red → Black

**Test 2: Chat**
1. Click purple chat bubble
2. Type: "What services does PV7-Provahan offer?"
3. Watch response stream in real-time
4. Check console for: `[ChatController] Retrieved 4 relevant chunks for context`

**Test 3: Session History**
1. Send 3-4 messages
2. Check that conversation history persists
3. Ask follow-up question - should have context

**Test 4: Error Handling**
1. Close backend server
2. Try sending message
3. Should show error message (not crash)

---

### Phase 4: Production Build

#### 4.1 Build for Production
```bash
npm run build
```

**What happens:**
- React code compiled and optimized
- Vite builds frontend to `dist/` folder
- TypeScript compiled to JavaScript
- ESBuild bundles backend to `dist/server.cjs`
- All assets minified

#### 4.2 Verify Build Output
```bash
ls -la dist/
# Should show:
# - index.html (SPA entry point)
# - assets/ (JS/CSS bundles)
# - server.cjs (compiled backend)
```

#### 4.3 Run Production Build
```bash
npm start
```

**Expected Output:**
```
[Startup] Running in PRODUCTION mode. Serving static files...
[Startup] Full-stack application running at: http://localhost:3000
```

#### 4.4 Test Production Build
```
Browser: http://localhost:3000
# Should work identically to dev mode
```

---

## 🐳 Docker Deployment

### Option 1: Using Dockerfile

#### Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
```

#### Build & Run:
```bash
# Build image
docker build -t pv7-portal:latest .

# Run container
docker run \
  -e GEMINI_API_KEY="your-api-key" \
  -p 3000:3000 \
  pv7-portal:latest
```

### Option 2: Using Docker Compose

#### Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      NODE_ENV: production
      PORT: 3000
    volumes:
      - ./PV7-Provahan\ Knowledge\ Base.pdf:/app/PV7-Provahan\ Knowledge\ Base.pdf
    restart: always
```

#### Run:
```bash
# Create .env.docker file with your API key
GEMINI_API_KEY="your-api-key" docker-compose up
```

---

## ☁️ Cloud Deployment

### Option 1: Vercel Deployment

#### 1. Install Vercel CLI
```bash
npm i -g vercel
```

#### 2. Configure for Vercel
Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "GEMINI_API_KEY": "@gemini_api_key"
  }
}
```

#### 3. Deploy
```bash
vercel --prod
```

#### 4. Add Secret
```bash
vercel env add GEMINI_API_KEY
# Paste your API key when prompted
```

### Option 2: Google Cloud Run Deployment

#### 1. Create `cloudbuild.yaml`:
```yaml
steps:
  - name: 'gcr.io/cloud-builders/npm'
    args: ['install']
  - name: 'gcr.io/cloud-builders/npm'
    args: ['run', 'build']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/pv7-portal', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/pv7-portal']
  - name: 'gcr.io/cloud-builders/run'
    args:
      - 'deploy'
      - 'pv7-portal'
      - '--image=gcr.io/$PROJECT_ID/pv7-portal'
      - '--region=us-central1'
      - '--set-env-vars=GEMINI_API_KEY=$_GEMINI_API_KEY'
```

#### 2. Deploy
```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_GEMINI_API_KEY="your-api-key"
```

### Option 3: Heroku Deployment

#### 1. Create `Procfile`:
```
web: npm start
```

#### 2. Deploy
```bash
heroku create pv7-portal
heroku config:set GEMINI_API_KEY="your-api-key"
git push heroku main
```

---

## 🔍 Verification & Testing

### Test Checklist

- [ ] **API Key Configured**
```bash
grep "GEMINI_API_KEY" .env
# Should show: GEMINI_API_KEY="AIzaSyD..."
```

- [ ] **Dependencies Installed**
```bash
npm list @google/genai
npm list express
npm list react
# All should show version numbers
```

- [ ] **Server Starts**
```bash
npm run dev
# Should see "[Startup] Full-stack application running..."
```

- [ ] **Frontend Loads**
```
Browser: http://localhost:3000
# Should see yellow page with purple chat bubble
```

- [ ] **Chat Works**
1. Click chat bubble
2. Type a message
3. Should get streaming response
4. Check console logs

- [ ] **Navigation Works**
1. Press → arrow key
2. Should switch to white page
3. Page color should change
4. Chat UI should adapt

- [ ] **Session Persists**
1. Send message
2. Refresh page
3. Message should still be in chat
4. Session cookie should exist

- [ ] **Rate Limiting Works**
1. Send 101 requests rapidly
2. 101st should return 429 error
3. Should be rate-limited

- [ ] **PDF Knowledge Base**
1. Check console for "Embeddings Loaded"
2. Check for `.embeddings_cache.json` file
3. File should contain chunks + embeddings

---

## 🛠️ Development Workflow

### File Watching & Hot Reload

**Frontend Changes:**
- Edit files in `src/`
- Vite automatically reloads
- No manual refresh needed

**Backend Changes:**
- Edit files in `backend/`
- Server auto-restarts (tsx watching)
- Connection may drop briefly

**Environment Changes:**
- Edit `.env` file
- Must manually restart: `npm run dev`

### Debugging

#### Enable Debug Logging:
```bash
DEBUG=* npm run dev
```

#### Check Server Logs:
```bash
# In development
npm run dev 2>&1 | tee server.log

# In production
tail -f /var/log/app.log
```

#### Browser DevTools:
1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Network tab shows API calls

#### Backend Debugging:
```javascript
// Add console logs in backend files
console.log("[DEBUG] Variable value:", value);
```

---

## 🚨 Troubleshooting

### Issue: "GEMINI_API_KEY is not configured in the environment variables"

**Causes:**
- .env file not created/loaded
- API key not set in .env
- Environment variable not exported

**Solutions:**
```bash
# 1. Check if .env exists
ls -la .env

# 2. Check if file has key
cat .env | grep GEMINI_API_KEY

# 3. If empty, add key
echo 'GEMINI_API_KEY="your-actual-key"' >> .env

# 4. Restart server
npm run dev
```

### Issue: "Cannot read properties of undefined (reading 'values')"

**Cause:** Embedding model failed  
**Solution:**
```bash
# Delete cache and regenerate
rm .embeddings_cache.json

# Restart server
npm run dev
```

### Issue: "Error: ENOENT: no such file or directory, open 'PV7-Provahan Knowledge Base.pdf'"

**Cause:** PDF knowledge base not found  
**Solution:**
```bash
# Server will auto-generate knowledge.pdf
# Wait for message: "[Startup] Fallback knowledge.pdf generated successfully."
# Or manually place PDF in project root
```

### Issue: "Port 3000 already in use"

**Cause:** Another app running on port 3000  
**Solutions:**
```bash
# Option 1: Kill existing process
lsof -i :3000
kill -9 <PID>

# Option 2: Use different port
PORT=3001 npm run dev

# Option 3: Configure in .env
echo "PORT=3001" >> .env
npm run dev
```

### Issue: "chat endpoint returns 429 (Too Many Requests)"

**Cause:** Rate limit exceeded (100 requests per 15 minutes)  
**Solution:** Wait 15 minutes or change rate limit in [backend/middleware/rateLimiter.ts](backend/middleware/rateLimiter.ts):
```typescript
const MAX_REQUESTS = 200; // Increase from 100
```

### Issue: "Cannot find module '@google/genai'"

**Cause:** Dependencies not installed  
**Solution:**
```bash
npm install
# or
npm install @google/genai @google/generative-ai
```

---

## 📈 Performance Optimization

### Frontend Optimization
```bash
# Build with source maps for debugging
npm run build -- --sourcemap

# Analyze bundle size
npm install -g rollup-plugin-visualizer
```

### Backend Optimization
```bash
# Enable production mode
NODE_ENV=production npm start

# Monitor performance
node --prof server.cjs
node --prof-process isolate-*.log > profile.txt
```

### Caching Strategy
- **Embeddings:** Cached with MD5 validation (~95% hit rate)
- **Static Assets:** Served with cache headers
- **Session:** 30-minute TTL in memory
- **API Responses:** No caching (always fresh)

---

## 📚 Environment Variables Reference

| Variable | Required | Default | Example |
|----------|----------|---------|---------|
| GEMINI_API_KEY | YES | (empty) | AIzaSyD... |
| PORT | NO | 3000 | 3000, 8080 |
| APP_URL | NO | http://localhost:3000 | https://myapp.com |
| NODE_ENV | NO | development | production |

---

## 🎓 Learning Resources

### About the Technology Stack
- [React 18 Docs](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Google Generative AI](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### About RAG Systems
- [RAG Introduction](https://cloud.google.com/use-cases/retrieval-augmented-generation)
- [Vector Embeddings Explained](https://www.cloudflare.com/learning/ai/what-are-embeddings/)
- [Semantic Search](https://www.elastic.co/what-is/semantic-search)

### Production Best Practices
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## ✅ Final Checklist Before Launch

- [ ] Gemini API key added to .env
- [ ] `npm install` completed successfully
- [ ] `npm run dev` starts without errors
- [ ] Chat functionality tested in browser
- [ ] All 4 pages navigate correctly
- [ ] Session history persists
- [ ] Rate limiting verified
- [ ] `npm run build` completes successfully
- [ ] `npm start` works for production
- [ ] Knowledge base PDF recognized
- [ ] Embeddings cache generated
- [ ] No console errors in DevTools
- [ ] API calls visible in Network tab
- [ ] Response streaming works
- [ ] Mobile responsive design verified

---

## 🎉 Congratulations!

Your PV7-Provahan AI Assistant Portal is now ready for deployment!

**Next Steps:**
1. Deploy to your chosen platform
2. Monitor logs and performance
3. Gather user feedback
4. Continuously improve responses
5. Add more knowledge base content

---

**Version:** 1.0.0  
**Last Updated:** July 6, 2026  
**Status:** Ready for Production Deployment
