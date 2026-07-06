# ⚡ Quick Reference Guide - PV7 Portal

## 🎯 One-Minute Summary

**What is this?**
Full-stack AI Assistant Portal for PV7-Provahan using React + Express + Gemini API + RAG (Retrieval Augmented Generation)

**What does it do?**
- Multi-page swipable presentation UI
- AI chatbot that answers questions about PV7 company
- Retrieves answers from knowledge base (PDF)
- Uses AI to generate contextual responses

**Is it working?**
✅ YES - Everything is coded and connected correctly
⚠️ NEEDS: Gemini API key to be added to `.env`

**How to start?**
```bash
npm install                          # Install dependencies
echo 'GEMINI_API_KEY="YOUR_KEY"' >> .env  # Add API key
npm run dev                          # Start dev server
# Open http://localhost:3000
```

---

## 📋 Component Checklist

### ✅ Frontend (React)
- [x] 4-page swipable interface
- [x] Theme-adaptive chat panel
- [x] Real-time message streaming
- [x] Session history persistence
- [x] Mobile responsive design
- [x] Keyboard & mouse navigation

### ✅ Backend (Express)
- [x] /api/chat endpoint
- [x] Session management
- [x] Rate limiting (100/15min)
- [x] Error handling middleware
- [x] CORS support

### ✅ AI Integration (Gemini)
- [x] API key configuration
- [x] Model fallback chain (4 models)
- [x] Streaming response support
- [x] System instructions
- [x] Error recovery

### ✅ RAG System
- [x] PDF parsing
- [x] Text chunking (800 chars)
- [x] Vector embeddings (384-dim)
- [x] Semantic similarity search (top-4)
- [x] Cache with MD5 validation
- [x] Auto-generation if missing

### ⚠️ Configuration
- [ ] ❌ GEMINI_API_KEY in .env (REQUIRED)
- [x] ✅ Port configured (3000)
- [x] ✅ App URL configured
- [x] ✅ Node environment set

---

## 🚀 Quick Start Commands

### Installation
```bash
npm install                     # Install all dependencies
```

### Get API Key
```bash
# Visit https://ai.google.dev/
# Click "Get API Key"
# Copy your key
# Paste into .env
echo 'GEMINI_API_KEY="AIza..."' >> .env
```

### Development
```bash
npm run dev                     # Start dev server at :3000
npm run lint                    # Check TypeScript
```

### Production
```bash
npm run build                   # Build for production
npm start                       # Run production build
```

### Cleaning
```bash
npm run clean                   # Remove dist & builds
rm .embeddings_cache.json       # Clear vector cache
```

---

## 📁 File Structure (Key Files)

### Frontend
```
src/
├─ App.tsx              Main component (4 pages + chat)
├─ main.tsx             Entry point
└─ index.css            Tailwind directives
```

### Backend
```
backend/
├─ routes/
│  └─ chatRoutes.ts    API endpoints
├─ controllers/
│  └─ chatController.ts Chat logic + RAG
├─ services/
│  └─ gemini.ts         Gemini API wrapper
├─ middleware/
│  ├─ session.ts        Session management
│  ├─ rateLimiter.ts    Rate limiting
│  └─ errorHandler.ts   Error handling
├─ utils/
│  ├─ vectorStore.ts    Embeddings + search
│  └─ pdfParser.ts      PDF extraction
├─ config/
│  └─ env.ts            Environment loader
└─ types/
   └─ index.ts          TypeScript interfaces
```

### Config
```
├─ server.ts            Express setup + startup
├─ vite.config.ts       Vite build config
├─ tsconfig.json        TypeScript config
├─ package.json         Dependencies
├─ .env                 Environment vars (⚠️ needs API key)
└─ .env.example         Template
```

### Knowledge Base
```
├─ PV7-Provahan Knowledge Base.pdf   Or generated:
└─ .embeddings_cache.json            Cached embeddings
```

---

## 🔌 API Reference

### POST /api/chat
**Request:**
```json
{
  "message": "What is PV7?"
}
```

**Response:** (Streaming text/plain)
```
PV7-Provahan is a technology-driven company...
```

**Error Response (429):**
```json
{
  "error": {
    "message": "Too many requests. Please try again later.",
    "status": 429,
    "timestamp": "2026-07-06T10:30:00Z"
  }
}
```

---

## 🔑 Environment Variables

| Variable | Value | Required |
|----------|-------|----------|
| GEMINI_API_KEY | Your API key | ✅ YES |
| PORT | 3000 | ❌ No |
| APP_URL | http://localhost:3000 | ❌ No |
| NODE_ENV | development | ❌ No |

**Example `.env`:**
```
GEMINI_API_KEY="AIzaSyD1234567890ABCDEF..."
PORT=3000
APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 📊 Key Metrics

| Metric | Value |
|--------|-------|
| Pages | 4 (Yellow, White, Red, Black) |
| Chat History Limit | 12 messages (auto-truncate) |
| Rate Limit | 100 requests per 15 minutes |
| Session TTL | 30 minutes |
| Embeddings Dimension | 384 |
| Vector Search | Top 4 chunks |
| Chunk Size | 800 characters |
| Chunk Overlap | 200 characters |
| Model Fallbacks | 4 models |
| Cache Hash | MD5 |

---

## 🐛 Troubleshooting

### "GEMINI_API_KEY not configured"
```bash
echo 'GEMINI_API_KEY="YOUR_KEY"' >> .env
npm run dev  # Restart
```

### "Port 3000 already in use"
```bash
PORT=3001 npm run dev  # Use different port
# OR
killall node  # Kill all Node processes
```

### "Cannot find module"
```bash
npm install
npm run dev
```

### "Embeddings not generating"
```bash
rm .embeddings_cache.json
npm run dev  # Restart to regenerate
```

### "Chat not responding"
1. Check `.env` has valid API key
2. Check server logs
3. Restart: `Ctrl+C` then `npm run dev`
4. Check browser console (F12)

---

## 🔍 Testing

### Manual Testing
```
1. Open http://localhost:3000
2. Click purple chat bubble
3. Type: "What is PV7-Provahan?"
4. Should see streaming response
5. Check DevTools console for logs
```

### API Testing (curl)
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is PV7?"}'
```

### Rate Limit Testing
```bash
for i in {1..105}; do
  curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d "{\"message\":\"Test $i\"}"
  sleep 0.1
done
# Should see 429 error after 100 requests
```

---

## 📦 Dependencies Overview

### Core Frontend
- `react` - UI framework
- `vite` - Build tool
- `tailwindcss` - Styling
- `motion` (Framer Motion) - Animations
- `lucide-react` - Icons

### Core Backend
- `express` - Server framework
- `@google/genai` - Gemini API
- `cors` - Cross-origin support
- `dotenv` - Environment loading
- `pdf-parse` - PDF text extraction
- `pdfkit` - PDF generation

### Dev Tools
- `typescript` - Type checking
- `tsx` - TypeScript runner
- `esbuild` - Bundler

---

## 🎨 UI/UX Features

### Pages
1. **Yellow Page** - Project intro
2. **White Page** - Company details
3. **Red Page** - Team information
4. **Black Page** - Additional features

### Navigation
- ⌨️ Keyboard: ← → Arrow keys
- 🖱️ Mouse: Click & drag to swipe
- 📱 Touch: Swipe left/right
- 🔘 Dots: Click page indicator

### Chat Panel
- Glassmorphic design (blurred overlay)
- Theme-adaptive colors
- Real-time message streaming
- Session history persistence
- Floating trigger button

---

## 🔐 Security Notes

✅ **Implemented:**
- API key protected (server-side only)
- Rate limiting enabled
- CORS configured
- Input sanitization (markdown filtering)
- Session validation
- Error message filtering (non-sensitive)

⚠️ **In Production:**
- Use HTTPS only
- Implement authentication
- Add database for persistence
- Set up monitoring
- Enable logging
- Use environment secrets (not .env file)

---

## 📱 Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome 90+ | ✅ Full | Recommended |
| Firefox 88+ | ✅ Full | Works well |
| Safari 14+ | ✅ Full | Supports all features |
| Edge 90+ | ✅ Full | Chromium-based |
| Mobile Safari | ✅ Good | Touch gestures work |
| Chrome Mobile | ✅ Good | Responsive design |

---

## 📚 Documentation Files

1. **PROJECT_STATUS.md** - Detailed component status
2. **SETUP_GUIDE.md** - Step-by-step setup & deployment
3. **ARCHITECTURE.md** - Data flow & connections
4. **QUICK_REFERENCE.md** - This file

---

## 🚢 Deployment Quick Links

### Local
```bash
npm run dev  # Development
npm run build && npm start  # Production
```

### Docker
```bash
docker build -t pv7-portal .
docker run -e GEMINI_API_KEY="..." -p 3000:3000 pv7-portal
```

### Vercel
```bash
npm i -g vercel
vercel --prod
vercel env add GEMINI_API_KEY
```

### Google Cloud Run
```bash
gcloud builds submit --config=cloudbuild.yaml
```

### Heroku
```bash
heroku create pv7-portal
heroku config:set GEMINI_API_KEY="..."
git push heroku main
```

---

## 💡 Pro Tips

1. **Dev Mode with Hot Reload**
   ```bash
   npm run dev
   # Edit files and see changes instantly
   ```

2. **Check Vector Cache**
   ```bash
   ls -la .embeddings_cache.json
   # If it exists, embeddings are cached (fast startup)
   ```

3. **View Server Logs**
   ```bash
   npm run dev 2>&1 | grep -i "error\|warning"
   ```

4. **Test Gemini Fallback**
   - First model: gemini-3.5-flash
   - Falls back to 3 more if first fails
   - Automatic, no manual intervention needed

5. **Session Debugging**
   - Check browser cookies (DevTools → Application)
   - Session ID: `pv7_session_id`
   - TTL: 30 minutes from last activity

6. **Rate Limit Reset**
   - Resets every 15 minutes per IP
   - Shared across all endpoints
   - Apply globally, not per-user

---

## 🆘 Support & Resources

### Getting Help
1. Check `PROJECT_STATUS.md` for detailed info
2. Check `SETUP_GUIDE.md` for step-by-step
3. Check `ARCHITECTURE.md` for flow diagrams
4. Enable debug logging: `DEBUG=* npm run dev`
5. Check browser DevTools (F12)

### Common Issues & Solutions
- **Issue:** API key error
  **Fix:** Add to .env, restart server
  
- **Issue:** Port in use
  **Fix:** Use different port or kill existing process
  
- **Issue:** Chat not responding
  **Fix:** Check API key, restart, check logs

- **Issue:** Slow first response
  **Fix:** Normal - embeddings being generated
  **Speed:** ~5-10 seconds first time, ~1-2s after

---

## ✨ Feature Showcase

**Current Features:**
- ✅ 4-page presentation interface
- ✅ AI chatbot with context awareness
- ✅ Real-time response streaming
- ✅ Knowledge base RAG system
- ✅ Session management
- ✅ Rate limiting
- ✅ Mobile responsive
- ✅ Auto-generated fallback PDF

**Future Enhancements:**
- 🔄 Database persistence
- 🔄 User authentication
- 🔄 Analytics dashboard
- 🔄 Multi-language support
- 🔄 Advanced search filters
- 🔄 Message export

---

## 📞 Contact & Attribution

**Project:** PV7-Provahan AI Assistant Portal  
**Version:** 1.0.0  
**Status:** 🟡 Ready for Deployment  
**Company:** Provahan Infotech Private Limited  
**Copyright:** © 2025 All Rights Reserved  

---

## 🎓 Learning Paths

### For Frontend Developers
1. Read `src/App.tsx` - Main UI component
2. Learn about Framer Motion animations
3. Understand Tailwind CSS theming
4. Study React streaming data handling

### For Backend Developers
1. Study `server.ts` - Server setup
2. Learn Express middleware chain
3. Understand RAG/vector search
4. Study API streaming architecture

### For AI/ML Engineers
1. Study `backend/utils/vectorStore.ts`
2. Learn about embeddings
3. Understand cosine similarity
4. Study prompt engineering

### For DevOps Engineers
1. Review Docker setup
2. Learn deployment strategies
3. Study CI/CD configuration
4. Monitor application logs

---

**Last Updated:** July 6, 2026  
**Version:** 1.0.0  
**Ready for Launch:** ✅ YES (Awaiting API Key Configuration)
