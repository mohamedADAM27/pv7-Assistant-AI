<div align="center">

# PV7 Assistant

### Production-Ready RAG AI Assistant for Enterprise Knowledge Retrieval

<img src="./assets/pv7-banner.png" alt="PV7 Assistant Banner" width="100%"/>

<br/>

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss)
![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?style=for-the-badge&logo=google)
![RAG](https://img.shields.io/badge/RAG-Powered-7B61FF?style=for-the-badge)

### Enterprise AI Assistant built for intelligent document retrieval, secure customer support, and modern presentation experiences.

</div>

---

# Overview

**PV7 Assistant** is a production-ready **Retrieval-Augmented Generation (RAG)** AI chatbot developed for **Provahan Infotech** to automate customer query resolution through intelligent document retrieval and context-aware conversations.

Unlike traditional chatbots that rely solely on LLM knowledge, PV7 Assistant retrieves relevant information from an enterprise knowledge base before generating responses, enabling significantly higher factual accuracy and reducing hallucinations.

The project combines a modern swipe-based presentation portal with an enterprise-grade AI assistant featuring secure backend architecture, prompt engineering, automatic Gemini model failover, and multiple security safeguards.

---

# Features

## AI & RAG

- Retrieval-Augmented Generation (RAG)
- Enterprise Knowledge Base Search
- PDF Document Retrieval
- Context-Aware Responses
- Google Gemini Integration
- Advanced Prompt Engineering
- Intelligent Context Matching
- Low-Latency Response Generation

---

## Enterprise Security

- Prompt Injection Mitigation
- Personally Identifiable Information (PII) Masking
- Secure Backend API Proxy
- Hidden API Keys
- Response Sanitization
- Markdown Filtering
- Environment Variable Isolation

---

## User Experience

- Swipe-Based Presentation Portal
- Theme Adaptive AI Assistant
- Glassmorphism Interface
- Responsive Layout
- Framer Motion Animations
- Modern Minimal UI
- Keyboard & Touch Navigation

---

# Architecture

```
                    User
                      │
                      ▼
           React + Vite Frontend
                      │
                      ▼
              Express Backend
                      │
                      ▼
         Retrieval Pipeline (RAG)
                      │
                      ▼
         Prompt Engineering Layer
                      │
                      ▼
          Google Gemini Models
                      │
                      ▼
        Response Sanitization Layer
                      │
                      ▼
                AI Response
```

---

# AI Request Flow

```
User Query
      │
      ▼
Retrieve Relevant Documents
      │
      ▼
Build Context
      │
      ▼
Prompt Engineering
      │
      ▼
Gemini API
      │
      ▼
Security Validation
      │
      ▼
Clean Response
      │
      ▼
Frontend Rendering
```

---

# Multi-Model Failover

PV7 Assistant implements an automatic fallback mechanism to ensure uninterrupted AI responses.

```
Gemini 2.5 Pro
        │
        ▼
Gemini 2.5 Flash
        │
        ▼
Gemini 1.5 Pro
        │
        ▼
Gemini 1.5 Flash
```

If a model becomes unavailable due to quota limits, rate limiting, or temporary service interruptions, the backend automatically switches to the next available model without affecting the user experience.

---

# User Interface

The application features a swipeable presentation environment consisting of four minimalist presentation canvases.

- Yellow Theme
- White Theme
- Red Theme
- Black Theme

The PV7 Assistant dynamically adapts its appearance based on the active presentation theme, ensuring visual consistency, readability, and accessibility.

---

# Screenshots

<p align="center">

<img src="./assets/pv7-demo.png" width="100%">

</p>

> Replace the placeholder above with your application screenshot.

---

# Technology Stack

| Category | Technologies |
|------------|-------------|
| Frontend | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Backend | Express.js |
| Runtime | Node.js |
| Language | TypeScript |
| AI | Google Gemini API |
| AI Techniques | Retrieval-Augmented Generation (RAG), Prompt Engineering |
| Icons | Lucide React |

---

# Project Structure

```
.
├── src
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── server.ts
├── package.json
├── tsconfig.json
├── metadata.json
├── index.html
├── .env.example
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/pv7-assistant.git

cd pv7-assistant
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env` file.

```env
GEMINI_API_KEY=YOUR_API_KEY
```

---

## Start Development Server

```bash
npm run dev
```

The application will be available at

```
http://localhost:3000
```

---

## Production Build

```bash
npm run build
```

---

## Start Production Server

```bash
npm start
```

---

# Security

PV7 Assistant follows enterprise-oriented security practices designed to protect both users and backend infrastructure.

### Implemented Protections

- Prompt Injection Detection & Mitigation
- PII Masking (Email Addresses, Phone Numbers)
- Backend API Proxy
- Secure Environment Variables
- Hidden Gemini API Key
- Sanitized AI Responses
- Clean Plain-Text Rendering

---

# Resume Highlights

- Developed **PV7 Assistant**, a production-ready Retrieval-Augmented Generation (RAG) AI chatbot for enterprise customer support.
- Integrated **Google Gemini API** with RAG and advanced prompt engineering techniques to generate accurate, context-aware responses.
- Implemented **prompt injection mitigation** and **PII masking** to prevent sensitive information such as phone numbers and email addresses from being exposed to the LLM.
- Built a secure Express backend with automatic Gemini multi-model failover for improved reliability and availability.
- Designed a modern swipe-based presentation interface with dynamic glassmorphism and responsive UI.

---

# Future Enhancements

- Voice Conversations
- Streaming AI Responses
- Multi-PDF Knowledge Base
- Authentication & User Roles
- Conversation History
- Analytics Dashboard
- Admin Portal
- Multi-language Support

---

# Author

**Mohamed Adam**

Computer Science Engineering Student

Passionate about Artificial Intelligence, Full Stack Development, and Building Production-Ready AI Systems.

---

<div align="center">

### ⭐ If you found this project interesting, consider giving it a star!

</div>
