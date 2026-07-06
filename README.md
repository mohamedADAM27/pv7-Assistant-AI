# PV7-Provahan Portal & Assistant
An enterprise-grade, high-fidelity swipable presentation portal equipped with a dynamic, theme-adaptive glassmorphic AI assistant ("PV7 Assistant"). Built with a full-stack architecture utilizing **React 18**, **Tailwind CSS**, **Framer Motion**, and a robust **Express** backend proxying the **Google Gemini API** with automatic multi-model failover orchestration.

---

## 🚀 Key Architectural Overview

This platform is engineered to serve as a clean, minimalist, high-contrast swipable presentation environment. It features four primary canvas pages (Yellow, White, Red, and Black) and a sophisticated conversational chatbot.

```
+-------------------------------------------------------------------------+
|                                                                         |
|                          PV7-Provahan Portal                            |
|                                                                         |
|  +--------------------+  +--------------------+  +--------------------+ |
|  |                    |  |                    |  |                    | |
|  |    Yellow Page     |  |     White Page     |  |      Red Page      | |
|  | (Swipable Canvas)  |  | (Swipable Canvas)  |  | (Swipable Canvas)  | |
|  |                    |  |                    |  |                    | |
|  +--------------------+  +--------------------+  +--------------------+ |
|                                                                         |
|                        +-----------------------+                        |
|                        |     PV7 Assistant     |                        |
|                        |  Adapts color/border  |                        |
|                        |   to current active   |                        |
|                        |     page palette      |                        |
|                        +-----------------------+                        |
+-------------------------------------------------------------------------+
```

---

## 🎨 User Interface & Presentation Layer

### 1. Minimalist Theme Canvas (Swipable Pages)
The core viewport is designed around minimalist physical color representations:
*   **Page 0 (Yellow Page):** Styled with solid `#FACC15` (`bg-yellow-400`).
*   **Page 1 (White Page):** Styled with solid `#FFFFFF` (`bg-white`).
*   **Page 2 (Red Page):** Styled with solid `#DC2626` (`bg-red-600`).
*   **Black Page**: Styled with solid `#0A0A0A` (`bg-neutral-950`).

All background text and illustrative distractions have been explicitly stripped to maintain a sleek, modern, and noise-free user experience. Navigation between these slides is handled with fluid mouse-drag/touch gestures and directional keyboard arrows.

### 2. Theme-Adaptive Glassmorphism
The **PV7 Assistant** chat panel utilizes advanced custom glassmorphism parameters. Instead of generic overlays, the chat panel’s design shifts dynamically to align with the active page theme to preserve visual contrast, contrast-safety ratios, and readability:

| Page / Theme | Chat Overlay Background | Border Style | Core Typography | Active Accent Dot |
| :--- | :--- | :--- | :--- | :--- |
| **Yellow Page** | `rgba(255, 255, 255, 0.15)` | `1px solid rgba(255, 255, 255, 0.25)` | Deep Indigo (`text-purple-950`) | Purple (`bg-purple-600`) |
| **White Page** | `rgba(255, 255, 255, 0.15)` | `1px solid rgba(255, 255, 255, 0.25)` | Slate Gray (`text-gray-800`) | Purple (`bg-purple-600`) |
| **Red Page** | `rgba(255, 255, 255, 0.15)` | `1px solid rgba(255, 255, 255, 0.25)` | Pure White (`text-white`) | White (`bg-white`) |
| **Black Page** | `rgba(255, 255, 255, 0.08)` | `1px solid rgba(255, 255, 255, 0.15)` | Off-White (`text-white`) | White (`bg-white`) |

---

## 🤖 Intelligent Conversational Engine

### 1. Robust Server-Side API Proxies
The application protects sensitive infrastructure credentials. The client is **completely decoupled** from backend API keys. All conversational queries are routed via Express to `/api/chat`, keeping the `GEMINI_API_KEY` safe behind server walls.

### 2. Multi-Model Failover Protocol
To guarantee high-availability and zero downtime during high demand spikes, the backend employs a hierarchical failover loop over Google's premier models:

1.  **Primary:** `gemini-2.5-pro` (Handles advanced logic, structured context matching, and rich knowledge processing).
2.  **Secondary Fallback:** `gemini-2.5-flash` (Ensures lightning-fast response times if the primary model is busy).
3.  **Tertiary Fallback:** `gemini-1.5-pro` (Provides comprehensive backup processing capabilities).
4.  **Quaternary Fallback:** `gemini-1.5-flash` (Last-mile resilience tier).

If a `503 Service Unavailable` or rate limit occurs on any model, the system executes an automated, transparent model-swap to the next fallback tier in real-time.

### 3. Ultra-Clean Text Processing
A key requirement of the corporate client layout is standard plain text outputs. All Markdown bold/italics elements (`**` and `*` characters) are filtered and sanitized server-side and client-side before rendering, producing highly polished, clean typography free of structural markdown noise.

---

## 🛠️ Technological Stack

*   **Frontend Library:** React 18 with Vite compiler.
*   **Motion and Physics:** `motion/react` (Framer Motion) for page transitions and hardware-accelerated swipe physics.
*   **Styling Engine:** Tailwind CSS with fluid grid layout parameters.
*   **Backend Server:** Express.js + Node.js.
*   **AI Integration:** `@google/genai` TypeScript SDK.
*   **Icons:** `lucide-react` library.

---

## 📦 File and Folder Structure

```
├── .env.example          # Template for server-side environment configurations
├── .gitignore            # Specifier for untracked workspace artifacts
├── index.html            # Main SPA mount vector
├── metadata.json         # Platform configuration & metadata parameters
├── package.json          # Dependency list and dev/build task scripts
├── server.ts             # Main Node.js/Express server containing multi-model routing
├── src/
│   ├── main.tsx          # Client-side application entrypoint
│   ├── index.css         # Tailwind directives and custom variables
│   └── App.tsx           # Full Swipable Deck layout, Glassmorphic Chat UI & state
└── tsconfig.json         # TypeScript compiler configurations
```

---

## 💻 Developer Installation and Execution Guide

### Prerequisites
*   Node.js (v18.x or newer recommended)
*   NPM (v9.x or newer)

### 1. Clone & Install Dependencies
Navigate into the workspace and run the standard dependency tree installer:
```bash
npm install
```

### 2. Environment Variables Configuration
Create a `.env` file in the root directory based on the `.env.example`:
```env
GEMINI_API_KEY=your_google_ai_studio_api_key_here
```
*(Never commit this key or files containing actual secrets to any git repository).*

### 3. Run the Development Server
Launch the full-stack development workspace (utilizing `tsx` to run the Express backend on port `3000` with the Vite SPA compiler embedded as middleware):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
To bundle both the backend server and static frontend assets into a production-optimized package:
```bash
npm run build
```
This script compiles the Express server into a single CJS bundle at `dist/server.cjs` via `esbuild` and outputs the static React client under the `dist` build path.

### 5. Launch Production Server
```bash
npm start
```

---

## 🔒 Security & Optimization Best Practices

*   **API Security:** The `GEMINI_API_KEY` is fully contained in `process.env` on the server and is never passed to or exposed in the browser.
*   **Zero-Flicker Transitions:** Page sliding uses spring-based drag physics with CSS hardware-acceleration and `AnimatePresence` to prevent layout reflows during swipe gestures.
*   **Low Latency Model Parameter Tuning:** Configured with low temperature parameters to accelerate output parsing times and avoid server-side token lag.
