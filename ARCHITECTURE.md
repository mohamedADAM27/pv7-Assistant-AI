# 🏗️ Complete Architecture & Connection Diagram

## Data Flow Diagram: User Message to AI Response

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                         USER INTERACTION FLOW                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Step 1: User Types Message in Chat
┌──────────────────────────┐
│  Frontend (React)        │
│  ┌────────────────────┐  │
│  │  Message Input    │  │
│  │  "What is PV7?"   │  │
│  └────────┬───────────┘  │
│           │              │
│           ▼              │
│  ┌────────────────────┐  │
│  │ handleSendMessage()│  │
│  │ • Trim input      │  │
│  │ • Add to messages │  │
│  │ • Call backend    │  │
│  └────────┬───────────┘  │
└──────────┼────────────────┘
           │
           │ (HTTP POST)
           ▼
┌──────────────────────────────────────────────┐
│  Express Backend Route Handler              │
│  POST /api/chat or /chat                    │
│  ┌──────────────────────────────────────┐  │
│  │ chatRoutes.ts                         │  │
│  │ • rateLimiter middleware             │  │
│  │ • sessionHandler middleware          │  │
│  │ • chatHandler controller             │  │
│  └──────────────┬───────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────┐
│  Rate Limiter Middleware                        │
│  rateLimiter.ts                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Get client IP                            │  │
│  │ Check if > 100 requests in 15 minutes   │  │
│  │ YES → return 429 error                  │  │
│  │ NO → pass to next middleware            │  │
│  └──────────────┬───────────────────────────┘  │
└─────────────────┼──────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────┐
│  Session Handler Middleware                     │
│  session.ts                                     │
│  ┌──────────────────────────────────────────┐  │
│  │ Parse session cookie or create new      │  │
│  │ Load conversation history from store    │  │
│  │ Attach to req.sessionData               │  │
│  │ Set TTL to 30 minutes                   │  │
│  └──────────────┬───────────────────────────┘  │
└─────────────────┼──────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│  Chat Controller (Main Logic)                       │
│  chatController.ts                                  │
│                                                    │
│  Step A: Extract Message & Session                │
│  ┌────────────────────────────────────────────┐  │
│  │ const { message } = req.body              │  │
│  │ const history = session?.history || []    │  │
│  └────────────────┬─────────────────────────┘  │
│                   │                             │
│                   ▼                             │
│  Step B: RAG Retrieval (Get Context)          │
│  ┌────────────────────────────────────────────┐  │
│  │ searchVectorStore(message, 4)             │  │
│  │ • Search embeddings for similar chunks   │  │
│  │ • Return top 4 matching context chunks   │  │
│  │ • Score by cosine similarity             │  │
│  └────────────────┬─────────────────────────┘  │
└────────────────────┼──────────────────────────────┘
                     │
                     │ (Async)
                     ▼
           ┌─────────────────────────┐
           │  Vector Store Utils     │
           │  vectorStore.ts         │
           │  ┌───────────────────┐ │
           │  │ searchVectorStore │ │
           │  │  (message, 4)     │ │
           │  └────────┬──────────┘ │
           │           │            │
           │           ▼            │
           │  ┌───────────────────┐ │
           │  │ generateEmbedding │ │
           │  │ (message text)    │ │
           │  │ Returns 384-dim   │ │
           │  │ embedding vector  │ │
           │  └────────┬──────────┘ │
           │           │            │
           │           ▼            │
           │  ┌───────────────────┐ │
           │  │ cosineSimilarity  │ │
           │  │ (msg_embedding    │ │
           │  │  vs each chunk)   │ │
           │  │ Range: 0.0-1.0   │ │
           │  └────────┬──────────┘ │
           │           │            │
           │           ▼            │
           │  ┌───────────────────┐ │
           │  │ sortByScore &     │ │
           │  │ returnTop4Chunks  │ │
           │  └────────┬──────────┘ │
           │           │            │
           └───────────┼────────────┘
                       │
       Returns 4 relevant chunks
       [
         {text: "...", score: 0.92},
         {text: "...", score: 0.87},
         {text: "...", score: 0.81},
         {text: "...", score: 0.76}
       ]
                       │
                       ▼
           ┌─────────────────────────┐
           │  Back to Controller     │
           │                         │
           │  Step C: Build Prompt  │
           │  ┌───────────────────┐ │
           │  │ contextText =     │ │
           │  │ chunks.join("\n") │ │
           │  │                   │ │
           │  │ systemInstruction │ │
           │  │ = "You are PV7..." │ │
           │  │                   │ │
           │  │ prompt = template │ │
           │  │ with context +    │ │
           │  │ history +         │ │
           │  │ current question  │ │
           │  └────────┬──────────┘ │
           └───────────┼────────────┘
                       │
                       ▼
           ┌─────────────────────────┐
           │  Step D: Stream from    │
           │  Gemini API             │
           │  ┌───────────────────┐ │
           │  │ generateChatStream│ │
           │  │ (prompt, system)  │ │
           │  └────────┬──────────┘ │
           └───────────┼────────────┘
                       │
                       │ (API Call)
                       ▼
           ┌──────────────────────────────────┐
           │  Gemini Service Layer            │
           │  gemini.ts                       │
           │  ┌──────────────────────────┐   │
           │  │ Initialize Gemini Client │   │
           │  │ (with API key)           │   │
           │  └──────────┬───────────────┘   │
           │             │                   │
           │             ▼                   │
           │  ┌──────────────────────────┐   │
           │  │ Try Primary Model:       │   │
           │  │ gemini-3.5-flash        │   │
           │  │                          │   │
           │  │ generateContentStream()  │   │
           │  │ config: {                │   │
           │  │   systemInstruction,    │   │
           │  │   temperature: 0.1      │   │
           │  │ }                        │   │
           │  └──────────┬───────────────┘   │
           │             │                   │
           │             ├─ Success? ✓      │
           │             │ Return stream    │
           │             │                  │
           │             ├─ Error? ✗       │
           │             │ Try next model  │
           │             │ (fallback chain)│
           │             │ 1. gemini-3.5  │
           │             │ 2. gemini-3.1  │
           │             │ 3. gemini-2.5  │
           │             │ 4. gemini-latest│
           │             │                  │
           │             ▼                  │
           │  ┌──────────────────────────┐  │
           │  │ Stream Response:         │  │
           │  │ "PV7-Provahan is a..."   │  │
           │  │ (chunks arriving)        │  │
           │  └──────────┬───────────────┘  │
           └─────────────┼──────────────────┘
                         │
                    Streaming chunks:
                    "PV7..." → "PV7-Provahan..." 
                    → "PV7-Provahan is..."
                    → ...full response
                         │
                         ▼
           ┌─────────────────────────────┐
           │  Back to Controller         │
           │                             │
           │  Step E: Stream to Client   │
           │  ┌───────────────────────┐ │
           │  │ res.setHeader(        │ │
           │  │   "Content-Type",     │ │
           │  │   "text/plain"        │ │
           │  │ )                     │ │
           │  │                       │ │
           │  │ For each chunk:       │ │
           │  │ • Clean markdown (*)  │ │
           │  │ • Write to response   │ │
           │  │ • Send to frontend    │ │
           │  │                       │ │
           │  │ When done:            │ │
           │  │ res.end()             │ │
           │  └───────────┬──────────┘ │
           └─────────────┼──────────────┘
                         │
                    HTTP Streaming
                    (Chunked transfer)
                         │
                         ▼
┌──────────────────────────────────────┐
│  Frontend (React)                    │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ sendChatToBackend()            │ │
│  │ Receives streaming response    │ │
│  │ • Reads chunks                 │ │
│  │ • Updates state in real-time   │ │
│  │ • Chat UI updates              │ │
│  └────────────┬───────────────────┘ │
│               │                      │
│               ▼                      │
│  ┌────────────────────────────────┐ │
│  │ Display Response to User       │ │
│  │ "PV7-Provahan is a platform... │ │
│  │  that enables buying, selling  │ │
│  │  and managing pre-owned        │ │
│  │  vehicles..."                  │ │
│  └────────────┬───────────────────┘ │
└────────────────┼────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │  Back to       │
        │  Controller    │
        │  (backend)     │
        │                │
        │  Step F:       │
        │  Update        │
        │  Session       │
        │  History       │
        │  ┌──────────┐  │
        │  │ Add user │  │
        │  │ message  │  │
        │  │ to       │  │
        │  │ history  │  │
        │  │          │  │
        │  │ Add AI   │  │
        │  │ response │  │
        │  │ to       │  │
        │  │ history  │  │
        │  │          │  │
        │  │ Limit to │  │
        │  │ 12 msgs  │  │
        │  │ (prevent │  │
        │  │ overflow)│  │
        │  └──────────┘  │
        └────────────────┘
                 │
                 ▼
        Session store updated
        (in memory)
        
        When user sends next message,
        context history will be included!
```

---

## System Component Connectivity Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                         REQUEST PIPELINE                           │
└─────────────────────────────────────────────────────────────────────┘

HTTP Request (POST /api/chat)
        │
        ▼
    Express App
    (server.ts)
        │
        ├─► app.use(cors())
        │   └─ Handles cross-origin requests
        │
        ├─► app.use(express.json())
        │   └─ Parses JSON request body
        │
        ├─► app.use(chatRouter)
        │   │
        │   ├─► Middleware 1: rateLimiter
        │   │   (backend/middleware/rateLimiter.ts)
        │   │   ├─ Get client IP
        │   │   ├─ Check request count
        │   │   ├─ Limit: 100 requests / 15 minutes
        │   │   └─ Pass or return 429
        │   │
        │   ├─► Middleware 2: sessionHandler
        │   │   (backend/middleware/session.ts)
        │   │   ├─ Parse cookies
        │   │   ├─ Load/create session
        │   │   ├─ Attach to req.sessionData
        │   │   └─ Auto-cleanup after 30 min
        │   │
        │   └─► Handler: chatHandler
        │       (backend/controllers/chatController.ts)
        │       │
        │       ├─► Step 1: Validate input
        │       │
        │       ├─► Step 2: searchVectorStore(message, 4)
        │       │   ├─ Call vectorStore.ts
        │       │   ├─ Generate embedding for user message
        │       │   ├─ Search against cached embeddings
        │       │   └─ Return top-4 similar chunks
        │       │
        │       ├─► Step 3: Build prompt
        │       │   ├─ Combine context chunks
        │       │   ├─ Add conversation history
        │       │   ├─ Add user question
        │       │   └─ Create system instruction
        │       │
        │       ├─► Step 4: Set response headers
        │       │   ├─ Content-Type: text/plain
        │       │   ├─ Transfer-Encoding: chunked
        │       │   └─ Connection: keep-alive
        │       │
        │       ├─► Step 5: generateChatStream()
        │       │   ├─ Call gemini.ts service
        │       │   ├─ Stream response chunks
        │       │   ├─ Write each chunk to response
        │       │   └─ Clean up markdown
        │       │
        │       ├─► Step 6: Update session
        │       │   ├─ Add user message + timestamp
        │       │   ├─ Add AI response + timestamp
        │       │   ├─ Limit history to 12 messages
        │       │   └─ Update session store
        │       │
        │       └─► Catch errors
        │           ├─ Call error middleware
        │           └─ Return error response
        │
        └─► Middleware: errorHandler
            (backend/middleware/errorHandler.ts)
            ├─ Log error
            ├─ Format error response
            └─ Send to client


┌──────────────────────────────────────────────────────────────┐
│              VECTOR STORE & RAG SUBSYSTEM                   │
└──────────────────────────────────────────────────────────────┘

On Server Startup:
    │
    ├─► ensurePdfExists()
    │   ├─ Check for "PV7-Provahan Knowledge Base.pdf"
    │   ├─ If missing, check for "knowledge.pdf"
    │   └─ If missing, auto-generate from hardcoded content
    │
    └─► initializeVectorStore(pdfPath)
        (backend/utils/vectorStore.ts)
        │
        ├─► Check .embeddings_cache.json
        │   ├─ Compute PDF MD5 hash
        │   ├─ Compare with cached hash
        │   ├─ If match: Load from cache ✓ FAST
        │   └─ If miss: Regenerate embeddings
        │
        └─► If regenerating:
            ├─► parsePdf(pdfPath)
            │   (backend/utils/pdfParser.ts)
            │   ├─ Extract text from PDF
            │   ├─ Clean formatting
            │   └─ Return full text
            │
            ├─► chunkText(text, 800, 200)
            │   ├─ Split by paragraphs
            │   ├─ Max chunk: 800 characters
            │   ├─ Overlap: 200 characters
            │   └─ Return array of chunks
            │
            ├─► For each chunk:
            │   └─► generateEmbedding(chunk)
            │       (backend/services/gemini.ts)
            │       ├─ Try: text-embedding-004
            │       ├─ Fallback: embedding-001
            │       ├─ Returns: 384-dimensional vector
            │       └─ Add to vectorStore array
            │
            └─► Save to .embeddings_cache.json
                ├─ Store PDF hash
                ├─ Store all chunks
                ├─ Store all embeddings
                └─ Cache hit next time ✓


During Chat:
    │
    └─► User message arrives
        │
        ├─► generateEmbedding(userMessage)
        │   └─ Returns 384-dim embedding
        │
        ├─► Search vectorStore
        │   ├─ For each cached chunk:
        │   │   ├─ Compute cosineSimilarity()
        │   │   │  (384-dim vectors)
        │   │   ├─ Score: 0.0 (dissimilar) to 1.0 (identical)
        │   │   └─ Store score
        │   │
        │   ├─ Sort by score (descending)
        │   └─ Return top-4 chunks
        │
        └─► Return format:
            [
              {
                id: "hash-0",
                text: "PV7-Provahan is...",
                embedding: [0.1, 0.2, ...],
                metadata: { source: "...", index: 0 }
              },
              ...
            ]


┌──────────────────────────────────────────────────────────────┐
│            GEMINI API INTEGRATION LAYER                      │
└──────────────────────────────────────────────────────────────┘

generateChatStream(prompt, systemInstruction)
    │
    └─► Create GoogleGenAI client
        (backend/services/gemini.ts)
        │
        ├─► Try Model 1: gemini-3.5-flash
        │   │
        │   ├─► generateContentStream({
        │   │     model: "gemini-3.5-flash",
        │   │     contents: prompt,
        │   │     config: {
        │   │       systemInstruction: "You are PV7 Assistant...",
        │   │       temperature: 0.1
        │   │     }
        │   │   })
        │   │
        │   ├─► Stream response chunks
        │   │   └─ Success: Return ✓
        │   │
        │   └─ Error? (429, 503, etc.)
        │       └─ Continue to next model
        │
        ├─► Try Model 2: gemini-3.1-flash-lite
        │   ├─ Success: Return ✓
        │   └─ Error: Continue
        │
        ├─► Try Model 3: gemini-2.5-flash
        │   ├─ Success: Return ✓
        │   └─ Error: Continue
        │
        ├─► Try Model 4: gemini-flash-latest
        │   ├─ Success: Return ✓
        │   └─ Error: Throw error
        │
        └─► If all fail: Throw "All backup models exhausted"


┌──────────────────────────────────────────────────────────────┐
│          SESSION MANAGEMENT SUBSYSTEM                        │
└──────────────────────────────────────────────────────────────┘

Session Store (In-Memory Map)
    │
    ├─► Key: sessionId (random 26-char string)
    │
    ├─► Value: Session Object {
    │     id: string,
    │     history: [
    │       {
    │         role: "user",
    │         text: "What is PV7?",
    │         timestamp: "2026-07-06T10:30:00Z"
    │       },
    │       {
    │         role: "model",
    │         text: "PV7-Provahan is...",
    │         timestamp: "2026-07-06T10:30:02Z"
    │       },
    │       ...
    │     ],
    │     createdAt: 1720325400000,
    │     lastActive: 1720325402000
    │   }
    │
    ├─► TTL: 30 minutes
    │   └─ Auto-delete if not accessed
    │
    ├─► Session Cookie
    │   ├─ Name: pv7_session_id
    │   ├─ Value: sessionId
    │   ├─ Sent on every request
    │   └─ Browser auto-manages
    │
    └─► Cleanup Process (Every 10 min)
        └─ Remove sessions inactive > 30 min
```

---

## Frontend Component Tree

```
App.tsx (Main Component)
│
├─► State Management
│   ├─ currentPageIndex (0-3)
│   ├─ isOpen (chat panel)
│   ├─ chatView ("dashboard" | "chat")
│   ├─ messages (array)
│   ├─ inputValue (string)
│   └─ direction (animation)
│
├─► Pages Array (4 pages)
│   ├─ Page 0: Yellow (Intro)
│   ├─ Page 1: White (Content)
│   ├─ Page 2: Red (Team)
│   └─ Page 3: Black (Features)
│
├─► Navigation
│   ├─ Keyboard: ← → arrow keys
│   ├─ Mouse: Click & drag
│   ├─ Touch: Swipe left/right
│   └─ Dots: Click indicator
│
├─► Main Render
│   ├─ <motion.div> (Swipe canvas)
│   │
│   ├─ <AnimatePresence> (Page content)
│   │   ├─ currentPageIndex === 0?
│   │   │   └─ <YellowPage>
│   │   │
│   │   ├─ currentPageIndex === 1?
│   │   │   └─ <WhitePage>
│   │   │
│   │   ├─ currentPageIndex === 2?
│   │   │   └─ <RedPage>
│   │   │
│   │   └─ currentPageIndex === 3?
│   │       └─ <BlackPage>
│   │
│   ├─ <ChatButton>
│   │   └─ Floating purple button
│   │       └─ onClick: setIsOpen(true)
│   │
│   ├─ <ChatPanel> (Glassmorphic overlay)
│   │   ├─ isOpen?
│   │   │
│   │   ├─ <ChatDashboard>
│   │   │   ├─ "Need Help?" buttons
│   │   │   ├─ Quick action buttons
│   │   │   └─ onClick handlers
│   │   │
│   │   └─ <ChatMessages>
│   │       ├─ Message list
│   │       ├─ Real-time streaming
│   │       ├─ Auto-scroll
│   │       └─ Timestamp display
│   │
│   └─ <ChatInput>
│       ├─ Form element
│       ├─ Input field
│       ├─ Send button
│       └─ onSubmit: sendChatToBackend()
│
└─► Message Handler Flow
    │
    ├─► handleInteract(text)
    │   ├─ Create user message
    │   ├─ Add to messages state
    │   ├─ Switch to chat view
    │   └─ Call sendChatToBackend()
    │
    ├─► handleSendMessage(e)
    │   ├─ Validate input not empty
    │   ├─ Create user message
    │   ├─ Add to messages state
    │   ├─ Clear input field
    │   └─ Call sendChatToBackend()
    │
    └─► sendChatToBackend(userText)
        ├─ Create "Thinking..." message
        ├─ POST to /api/chat
        ├─ Get streaming response
        │   ├─ Read chunks
        │   ├─ Remove markdown (*)
        │   ├─ Update message state
        │   ├─ Real-time display
        │   └─ Auto-scroll
        ├─ Handle errors
        └─ Display error message
```

---

## Data Flow Summary: Key Connections

### Connection 1: Frontend to Backend
```
React Component
    │ fetch("/api/chat", {method: "POST", ...})
    ▼
Express Router
    │ POST /api/chat
    ▼
Rate Limiter → Session Handler → Chat Controller
```

### Connection 2: Chat Controller to RAG
```
Chat Controller
    │ searchVectorStore(message, 4)
    ▼
Vector Store Utils
    │ generateEmbedding(message)
    ▼
Gemini Service (Embeddings API)
    │ Returns 384-dim vector
    ▼
Vector Store
    │ Compare with cached embeddings
    ▼
Return top-4 chunks
```

### Connection 3: Chat Controller to Gemini
```
Chat Controller
    │ generateChatStream(prompt, systemInstruction)
    ▼
Gemini Service
    │ Try primary model: gemini-3.5-flash
    │ (If fails, try fallback models)
    ▼
Google Generative AI API
    │ Stream response chunks
    ▼
Gemini Service
    │ Yield chunks to controller
    ▼
Chat Controller
    │ Send chunks to frontend
```

### Connection 4: Frontend Streaming Display
```
Frontend sendChatToBackend()
    │ reader = response.body?.getReader()
    ▼
Stream Chunks Arrive
    │ const chunk = decoder.decode(value)
    ▼
Update React State
    │ setMessages(prev => ...)
    ▼
Component Re-renders
    │ Display updated text
    ▼
Browser Scrolls to Bottom
    │ Auto-scroll for new messages
```

---

## Error Handling Flow

```
Error Occurs at Any Level
│
├─► Level 1: Rate Limiter
│   └─ Return 429 JSON error
│
├─► Level 2: Session Handler
│   └─ Continue anyway (non-critical)
│
├─► Level 3: Chat Controller
│   ├─ Try-catch wraps Gemini call
│   ├─ If error: Call errorHandler
│   └─ If streaming: Write error to stream
│
├─► Level 4: Gemini Service
│   ├─ Model fails? Try next model
│   ├─ All models fail? Throw error
│   └─ Controller catches it
│
├─► Level 5: Global Error Handler
│   ├─ Log error
│   ├─ Format response
│   ├─ Send JSON error to frontend
│   └─ Include status code
│
└─► Frontend
    ├─ Catch fetch error
    ├─ Parse error message
    ├─ Display error in chat
    └─ Allow user to retry
```

---

## State Flow Diagram

```
Frontend State
│
├─► currentPageIndex
│   └─ 0 (Yellow) → 1 (White) → 2 (Red) → 3 (Black) → 0 (Loop)
│       Changed by: Arrow keys, Dots, Drag
│
├─► isOpen
│   └─ false → true → false (Chat panel visibility)
│       Changed by: Chat button, Close button
│
├─► chatView
│   └─ "dashboard" ↔ "chat"
│       Changed by: Quick action buttons, Chat buttons
│
├─► messages
│   └─ Array[{id, text, sender, timestamp}, ...]
│       Modified: Add user message, Add AI response
│
├─► inputValue
│   └─ "" → "User typed..." → "" (after send)
│       Modified: onChange event, Clear after send
│
└─► dinoMsgIndex
    └─ 0 → 1 → 2 → ... → 6 → 0 (Dino tip rotation)
        Changed: Every 8 seconds


Backend State (Session Store)
│
├─► sessionStore (Map)
│   └─ Map<sessionId, Session>
│       Add: When new session created
│       Update: When message added
│       Delete: When 30min TTL expires
│
└─► vectorStore (In-Memory Array)
    └─ Array[{id, text, embedding, metadata}, ...]
        Loaded: At server startup
        Updated: When PDF changes (MD5 check)
        Persisted: In .embeddings_cache.json
```

---

## Complete Technology Stack Connections

```
┌────────────────────────────────────────────────────────────┐
│                      Application Layer                    │
│  React 18 + TypeScript + Tailwind CSS + Framer Motion    │
└────────────────────────────────────────────────────────────┘
                          │ HTTP
                          ▼
┌────────────────────────────────────────────────────────────┐
│                    Express.js Backend                     │
│  TypeScript + Node.js + CORS + Middleware Stack          │
└────────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
   ┌────────────┐  ┌──────────────┐  ┌──────────────┐
   │Session Mgmt│  │Rate Limiting │  │Error Handler │
   └────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │Chat Controller   │
                 │Vector Search     │
                 │Prompt Building   │
                 │Streaming Handler │
                 └─────┬────────┬───┘
                       │        │
            ┌──────────┘        └──────────┐
            │                              │
            ▼                              ▼
       ┌────────────────┐        ┌─────────────────────┐
       │Vector Store    │        │Gemini Service Layer │
       │- Embeddings    │        │- Model Fallback     │
       │- Similarity    │        │- Streaming API      │
       │- Cache Mgmt    │        │- Error Recovery     │
       └─────┬──────────┘        └──────────┬──────────┘
             │                              │
             ▼                              ▼
       ┌────────────────┐        ┌─────────────────────┐
       │PDF Parser      │        │Google GenAI         │
       │Text Chunking   │        │Embeddings API       │
       │Cache Layer     │        │Chat Streaming API   │
       └────────────────┘        └─────────────────────┘
             │                              │
             ▼                              ▼
       ┌────────────────┐        ┌─────────────────────┐
       │PV7 Knowledge   │        │Google Gemini Models │
       │Base PDF        │        │- 3.5-flash          │
       │(or generated)  │        │- 3.1-flash-lite     │
       │                │        │- 2.5-flash          │
       │.embeddings_    │        │- flash-latest       │
       │cache.json      │        │                     │
       └────────────────┘        └─────────────────────┘
```

---

## Configuration & Environment Connections

```
.env File (Development)
│
├─ GEMINI_API_KEY → backend/config/env.ts → gemini.ts → Google API
├─ PORT → server.ts → Express listen()
├─ APP_URL → frontend links, OAuth callbacks
└─ NODE_ENV → server.ts → Vite vs Static serving

.env.example (Template)
│
└─ Shows all required variables

tsconfig.json
│
├─ Compilation target
├─ Module system
├─ Path aliases (@/)
└─ Type checking

vite.config.ts
│
├─ React plugin
├─ Tailwind plugin
├─ Dev server config
└─ Build optimization

package.json
│
├─ npm run dev → tsx server.ts (with watching)
├─ npm run build → Vite + ESBuild
├─ npm run start → Node dist/server.cjs
└─ Dependencies & dev dependencies
```

---

## API Contract

### Request
```http
POST /api/chat HTTP/1.1
Content-Type: application/json

{
  "message": "What is PV7-Provahan?"
}
```

### Response (Streaming)
```http
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive

PV7-Provahan is a...technology-driven company...
transforming India's...used vehicle...industry...
```

---

## Complete Data Model

```typescript
// Frontend Message
interface Message {
  id: string;                           // Date.now().toString()
  text: string;                         // User or AI text
  sender: "user" | "bot";               // Who sent it
  timestamp: string;                    // Locale time string
}

// Backend Message (in session history)
interface Message {
  role: "user" | "model";               // Who sent it
  text: string;                         // Message content
  timestamp: string;                    // ISO datetime
}

// Session Object (in memory)
interface Session {
  id: string;                           // Session ID (26-char)
  history: Message[];                   // Conversation history
  createdAt: number;                    // Timestamp
  lastActive: number;                   // Last activity timestamp
}

// Vector Store Chunk
interface Chunk {
  id: string;                           // hash-index
  text: string;                         // 800-char chunk
  embedding: number[];                  // 384-dimensional vector
  metadata: {
    source: string;                     // "PV7-Provahan Knowledge Base.pdf"
    index: number;                      // Chunk index
  };
}

// Cached Embeddings
interface EmbedCacheData {
  pdfHash: string;                      // MD5 hash of PDF
  chunks: CachedEmbedding[];            // Array of chunks
}
```

---

**This architecture enables a fully functional AI assistant with:**
- ✅ Real-time streaming responses
- ✅ Context-aware conversation history
- ✅ RAG-based knowledge retrieval
- ✅ Automatic error recovery
- ✅ Production-ready deployment
