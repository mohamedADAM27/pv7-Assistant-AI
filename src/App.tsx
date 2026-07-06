/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  X, 
  Send, 
  ChevronLeft, 
  ChevronRight,
  MessageCircle,
  PhoneCall,
  Mail,
  LayoutGrid,
  ArrowLeft,
  Linkedin,
  Instagram,
  Github
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

const DinosaurSVG = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14 fill-current drop-shadow-md">
    {/* Tail */}
    <path d="M10,80 Q25,85 40,70" strokeWidth="6" strokeLinecap="round" stroke="currentColor" fill="none" />
    {/* Body */}
    <path d="M40,70 Q55,60 55,45 Q55,30 70,30 Q78,30 80,42 Q82,50 78,55 Q75,58 60,62 Q45,66 40,70 Z" />
    {/* Head snout */}
    <path d="M70,30 L85,30 Q90,30 90,38 Q90,45 80,45 L70,45 Z" />
    {/* Eye */}
    <circle cx="78" cy="36" r="2.5" fill="white" />
    {/* Tiny arms */}
    <path d="M68,52 L74,55" strokeWidth="4" strokeLinecap="round" stroke="currentColor" />
    {/* Feet */}
    <rect x="44" y="68" width="6" height="14" rx="3" />
    <rect x="54" y="68" width="6" height="14" rx="3" />
  </svg>
);

const dinoMessages = [
  "Hi! I'm Dino. Drag me anywhere!",
  "Swipe left/right or use keys to swap slides!",
  "Need help? Click the PV7 Assistant bubble!",
  "We are currently running Prototype MVP 1.",
  "Check out the Red page to meet Adam, my creator!",
  "Click me to cycle my guiding tips!",
  "Hold and move me to any corner you like!"
];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatView, setChatView] = useState<"dashboard" | "chat">("dashboard");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [dinoMsgIndex, setDinoMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDinoMsgIndex((prev) => (prev + 1) % dinoMessages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // 3 horizontal sliding pages
  const pages = [
    { 
      id: "yellow", 
      bgClass: "bg-yellow-400", 
      textClass: "text-purple-950", 
      dotActive: "bg-purple-600", 
      dotInactive: "bg-purple-950/20 hover:bg-purple-950/40",
      arrowClass: "text-purple-950/60 hover:text-purple-950 hover:bg-purple-950/10",
      chatBg: "rgba(255, 255, 255, 0.15)",
      chatBorder: "1px solid rgba(255, 255, 255, 0.25)",
      chatHeader: "text-purple-950",
      chatClose: "text-purple-950/60 hover:text-purple-950 hover:bg-white/10",
      msgBotBg: "rgba(255, 255, 255, 0.2)",
      msgBotText: "text-purple-950",
      msgBotBorder: "1px solid rgba(255, 255, 255, 0.1)",
      msgTimestamp: "text-purple-950/65",
      inputBg: "bg-white/10 hover:bg-white/15 focus:bg-white/20",
      inputBorder: "border-white/15",
      inputText: "text-purple-950 placeholder:text-purple-950/45 focus:ring-white/10",
      headerBg: "bg-white/5",
      inputFormBg: "bg-white/5",
      borderCol: "border-white/15",
      dinoClass: "text-purple-950"
    },
    { 
      id: "white", 
      bgClass: "bg-white", 
      textClass: "text-gray-800", 
      dotActive: "bg-purple-600", 
      dotInactive: "bg-purple-950/20 hover:bg-purple-950/40",
      arrowClass: "text-purple-950/60 hover:text-purple-950 hover:bg-purple-950/10",
      chatBg: "rgba(255, 255, 255, 0.15)",
      chatBorder: "1px solid rgba(255, 255, 255, 0.25)",
      chatHeader: "text-purple-950",
      chatClose: "text-purple-950/60 hover:text-purple-950 hover:bg-white/10",
      msgBotBg: "rgba(255, 255, 255, 0.2)",
      msgBotText: "text-purple-950",
      msgBotBorder: "1px solid rgba(255, 255, 255, 0.1)",
      msgTimestamp: "text-purple-950/65",
      inputBg: "bg-white/10 hover:bg-white/15 focus:bg-white/20",
      inputBorder: "border-white/15",
      inputText: "text-purple-950 placeholder:text-purple-950/45 focus:ring-white/10",
      headerBg: "bg-white/5",
      inputFormBg: "bg-white/5",
      borderCol: "border-white/15",
      dinoClass: "text-purple-900"
    },
    { 
      id: "red", 
      bgClass: "bg-red-600", 
      textClass: "text-white", 
      dotActive: "bg-white", 
      dotInactive: "bg-white/30 hover:bg-white/50",
      arrowClass: "text-white/60 hover:text-white hover:bg-white/10",
      chatBg: "rgba(255, 255, 255, 0.15)",
      chatBorder: "1px solid rgba(255, 255, 255, 0.25)",
      chatHeader: "text-white",
      chatClose: "text-white/60 hover:text-white hover:bg-white/10",
      msgBotBg: "rgba(255, 255, 255, 0.2)",
      msgBotText: "text-white",
      msgBotBorder: "1px solid rgba(255, 255, 255, 0.1)",
      msgTimestamp: "text-white/70",
      inputBg: "bg-white/10 hover:bg-white/15 focus:bg-white/20",
      inputBorder: "border-white/15",
      inputText: "text-white placeholder:text-white/45 focus:ring-white/10",
      headerBg: "bg-white/5",
      inputFormBg: "bg-white/5",
      borderCol: "border-white/15",
      dinoClass: "text-white"
    }
  ];

  const handleNext = () => {
    if (currentPageIndex < pages.length - 1) {
      setDirection(1);
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setDirection(-1);
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I am your PV7 Assistant. How can I assist you today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPageIndex]);

  const getAssistantResponse = (userInput: string): string => {
    const input = userInput.toLowerCase().trim();
    
    // Exact FAQ mappings
    if (input.includes("what is pv7-provahan")) {
      return "PV7-Provahan is a premium, real-time vehicle booking, automated logistics scheduling, and document verification suite powered by robust APIs and secure cloud infrastructure.";
    }
    if (input.includes("types of vehicles") || input.includes("vehicles are supported")) {
      return "We support a wide array of logistics options including commercial cargo trucks, heavy-duty distribution containers, corporate delivery vans, and eco-friendly electric transit shuttles.";
    }
    if (input.includes("is it safe")) {
      return "Absolutely. Security is our top priority. All communications are encrypted, and all partners undergo rigid background, identification, and transport safety checks.";
    }
    if (input.includes("verify documents") || input.includes("does pv7-provahan verify")) {
      return "Yes! We employ real-time advanced optical character recognition (OCR) and instant secure verifications to validate vehicle papers, registrations, insurance documents, and driver permits.";
    }
    if (input.includes("how do i contact") || input.includes("contact support")) {
      return "You can reach us instantly via our interactive buttons (WhatsApp, Callback, or Mail) right inside this dashboard, or directly email us at support@pv7-provahan.com!";
    }

    // Quick Action mappings
    if (input.includes("whatsapp")) {
      return "Connecting you to our secure PV7 WhatsApp Business Channel...\n\n✅ Live support agents are online. Please call or chat at +1 (555) 787-7700.";
    }
    if (input.includes("callback")) {
      return "Understood. I have initiated a Priority Callback Ticket.\n\n📞 A member of the PV7 support desk will call you back within 15 minutes at your registered profile number.";
    }
    if (input.includes("mail us") || input.includes("mail")) {
      return "Opening your mail composer to contact support...\n\n✉️ You can send your detailed queries directly to support@pv7-provahan.com. We usually respond within 30 minutes!";
    }
    if (input.includes("explore services") || input.includes("explore")) {
      return "Here are the primary premium enterprise services we offer:\n\n1️⃣ Fleet Automated Routing\n2️⃣ Instant KYC and Document Verification\n3️⃣ On-Demand Cargo Freight Matching\n4️⃣ Enterprise Level Analytics Dashboard\n\nLet me know if you would like info on any of these!";
    }

    if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
      return "Hello! I am your PV7 Assistant. How can I assist you today?";
    }
    if (input.includes("features") || input.includes("pv7")) {
      return "PV7 Assistant features: \n• Multipage swipe space: Yellow ➔ White ➔ Red ➔ Black\n• Highly-responsive floating interaction button\n• Elegant Scale & Fade transition animations\n• Plain text chat interface with live stamps";
    }
    if (input.includes("yellow") || input.includes("background") || input.includes("color") || input.includes("swipe") || input.includes("theme") || input.includes("page")) {
      return "You can swipe horizontally on the screen, use your keyboard arrow keys, or click the bottom indicator dots to switch between pages: Yellow ➔ White ➔ Red ➔ Black!";
    }
    if (input.includes("purple") || input.includes("button")) {
      return "The Royal Purple floating trigger button serves as the high-contrast focal action point on this dynamic canvas.";
    }
    if (input.includes("help") || input.includes("what can you do")) {
      return "I can demonstrate dynamic animations, reply instantly to your questions, explain the layout of PV7, or just chat with you in plain text!";
    }
    return `You said: "${userInput}"\n\nThat is interesting! As the PV7 Assistant, I'm fully capable of handling plain text inputs. Let me know if you want to explore more features of this app.`;
  };

  const sendChatToBackend = async (userText: string) => {
    const botMsgId = (Date.now() + 1).toString();
    
    // Add a temporary typing indicator/thinking message
    const typingMessage: Message = {
      id: botMsgId,
      text: "Thinking...",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const endpoint = apiUrl ? `${apiUrl}/api/chat` : "/api/chat";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) {
        let errorMsg = `Server returned status ${response.status}`;
        try {
          const errData = await response.json();
          if (errData && errData.error && errData.error.message) {
            errorMsg = errData.error.message;
          } else if (errData && errData.error) {
            errorMsg = typeof errData.error === "string" ? errData.error : JSON.stringify(errData.error);
          }
        } catch (_) {
          // Ignore parse error
        }
        throw new Error(errorMsg);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (reader) {
        // Clear the "Thinking..." text first
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId ? { ...msg, text: "" } : msg
          )
        );

        let streamText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          streamText += chunk;

          // Replace thinking state with current streamed text (remove markdown bold markers)
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId ? { ...msg, text: streamText.replace(/\*/g, "") } : msg
            )
          );
        }
      } else {
        const data = await response.json();
        // Replace thinking state with the Gemini response
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId ? { ...msg, text: (data.reply || "No reply received.").replace(/\*/g, "") } : msg
          )
        );
      }
    } catch (err: any) {
      console.error("Chat backend fetch error:", err);
      const errorMessage = `Backend Error: ${err.message || "An unexpected error occurred during request execution."}`;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId ? { ...msg, text: errorMessage } : msg
        )
      );
    }
  };

  const handleInteract = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatView("chat");
    sendChatToBackend(text);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatView("chat");
    const originalInput = inputValue;
    setInputValue("");
    sendChatToBackend(originalInput);
  };



  return (
    <div 
      id="app-container" 
      className={`fixed inset-0 w-screen h-screen overflow-hidden font-sans select-none transition-all duration-700 ease-in-out ${pages[currentPageIndex].bgClass}`}
    >
      
      {/* Swipeable Canvas Layer */}
      <motion.div
        id="swipe-canvas"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(event, info) => {
          const swipeThreshold = 50;
          if (info.offset.x < -swipeThreshold) {
            handleNext();
          } else if (info.offset.x > swipeThreshold) {
            handlePrev();
          }
        }}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center z-10"
      >
      </motion.div>

      {/* Page Contents Layer */}
      <div 
        id="page-content-layer" 
        className="absolute inset-0 z-20 flex flex-col items-center justify-start overflow-y-auto pt-16 pb-28 px-4 md:px-12 lg:px-24 select-text scrollbar-none"
      >
        <AnimatePresence mode="wait">
          {currentPageIndex === 0 && (
            <motion.div
              key="yellow-car-page"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(event, info) => {
                const swipeThreshold = 50;
                if (info.offset.x < -swipeThreshold) {
                  handleNext();
                } else if (info.offset.x > swipeThreshold) {
                  handlePrev();
                }
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xl mx-auto flex items-center justify-center min-h-[70vh] py-4"
            >
              <div 
                id="yellow-box-layout" 
                className="w-full p-8 md:p-12 rounded-[32px] border border-white/40 shadow-2xl text-center space-y-8 select-text"
                style={{
                  background: "rgba(255, 255, 255, 0.45)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                }}
              >
                <div className="space-y-3">
                  <h1 
                    className="text-3xl md:text-5xl font-black text-purple-950 tracking-tight leading-tight uppercase"
                    style={{ fontFamily: "Times New Roman" }}
                  >
                    Virtual Assistant
                  </h1>
                  <h2 
                    className="text-base md:text-lg font-bold text-purple-900/80 tracking-wide uppercase"
                    style={{ fontFamily: "Courier New" }}
                  >
                    For Provahan Infotech Pvt Ltd
                  </h2>
                </div>

                <div className="py-4 border-y border-purple-950/10 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-black text-purple-900/50 uppercase tracking-widest mb-1">Project Milestone</span>
                  <span className="text-xl font-black text-purple-950 tracking-wide">PROTOTYPE MVP 1</span>
                </div>

                <div className="flex items-center justify-center gap-2 text-purple-950/70 font-bold text-xs animate-bounce pt-4">
                  <span>Swipe next to see details</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </motion.div>
          )}

          {currentPageIndex === 1 && (
            <motion.div
              key="white-page-content"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(event, info) => {
                const swipeThreshold = 50;
                if (info.offset.x < -swipeThreshold) {
                  handleNext();
                } else if (info.offset.x > swipeThreshold) {
                  handlePrev();
                }
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl mx-auto flex items-center justify-center min-h-[70vh] py-4"
            >
              <div 
                id="white-box-layout" 
                className="w-full p-6 md:p-10 rounded-[32px] border border-gray-200/50 shadow-2xl text-left space-y-6 select-text"
                style={{
                  background: "rgba(255, 255, 255, 0.75)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                }}
              >
                <div className="space-y-1">
                  <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
                    About the PV7 Assistant
                  </h1>
                </div>

                <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
                  The PV7 Assistant is an advanced custom conversational bot built directly to support users on the Provahan platform. Here is how it operates:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {[
                    { 
                      title: "Automatic Fallback Failover", 
                      desc: "The assistant orchestrates multi-model requests server-side. It prioritizes advanced reasoning and falls back seamlessly to speed-optimized models if limits are reached." 
                    },
                    { 
                      title: "Robust Document Verification", 
                      desc: "Supports quick identification, scanning, and instant background checks of driver papers, registrations, and vehicle clearance." 
                    },
                    { 
                      title: "Optimized Plain Text Output", 
                      desc: "Fully filters markdown annotations to output incredibly clean, polished, professional, and accessible messages." 
                    },
                    { 
                      title: "Dynamic Visual Adaptation", 
                      desc: "Adapts visual overlay glassmorphism, input styling, and accessibility layers instantly to match the background of each page." 
                    }
                  ].map((feat, index) => (
                    <div key={index} className="p-4 rounded-[20px] bg-slate-50/50 border border-slate-100 flex flex-col space-y-1">
                      <span className="text-[11px] text-slate-600 font-medium leading-relaxed">{feat.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentPageIndex === 2 && (
            <motion.div
              key="red-page-content"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(event, info) => {
                const swipeThreshold = 50;
                if (info.offset.x < -swipeThreshold) {
                  handleNext();
                } else if (info.offset.x > swipeThreshold) {
                  handlePrev();
                }
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xl mx-auto flex items-center justify-center min-h-[70vh] py-4"
            >
              <div 
                id="red-box-layout" 
                className="w-full p-8 md:p-12 rounded-[32px] border border-white/35 shadow-2xl text-center space-y-8 select-text"
                style={{
                  background: "rgba(220, 38, 38, 0.45)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                }}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-red-100 uppercase tracking-widest">FSD AI Intern</span>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
                      Created by MOHAMED ADAM Y
                    </h1>
                    <p className="text-xs md:text-sm text-white/90 font-medium tracking-wide uppercase">
                      FSD AI Intern @ Provahan Infotech Pvt Ltd
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/20">
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3.5 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all shadow-md flex items-center justify-center"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3.5 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all shadow-md flex items-center justify-center"
                    aria-label="Instagram Profile"
                  >
                    <Instagram size={20} />
                  </a>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3.5 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all shadow-md flex items-center justify-center"
                    aria-label="GitHub Profile"
                  >
                    <Github size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Left Navigation Arrow */}
      {currentPageIndex > 0 && (
        <button
          id="nav-arrow-left"
          onClick={handlePrev}
          className={`absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-300 z-40 hidden md:flex items-center justify-center cursor-pointer border-none outline-none focus:ring-2 focus:ring-purple-300 ${pages[currentPageIndex].arrowClass}`}
          aria-label="Previous Page"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Right Navigation Arrow */}
      {currentPageIndex < pages.length - 1 && (
        <button
          id="nav-arrow-right"
          onClick={handleNext}
          className={`absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-300 z-40 hidden md:flex items-center justify-center cursor-pointer border-none outline-none focus:ring-2 focus:ring-purple-300 ${pages[currentPageIndex].arrowClass}`}
          aria-label="Next Page"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Bottom Page Indicator Dots */}
      <div id="page-indicators" className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-40 items-center">
        {pages.map((page, idx) => (
          <button
            key={page.id}
            id={`indicator-dot-${page.id}`}
            onClick={() => {
              setDirection(idx > currentPageIndex ? 1 : -1);
              setCurrentPageIndex(idx);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 border-none cursor-pointer outline-none ${
              currentPageIndex === idx 
                ? `w-8 ${pages[currentPageIndex].dotActive} shadow-sm` 
                : `${pages[currentPageIndex].dotInactive}`
            }`}
            aria-label={`Go to page ${idx + 1}`}
          />
        ))}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-window"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="fixed flex flex-col overflow-hidden z-50 shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
            style={{
              position: "fixed",
              bottom: "105px",
              right: "24px",
              width: "calc(100% - 48px)",
              maxWidth: "385px",
              height: "calc(100vh - 140px)",
              maxHeight: "680px",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(15px)",
              WebkitBackdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "20px",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
              padding: "20px",
              transition: "all 0.5s ease",
            }}
          >
            {/* Header: Logo, Title, Back Arrow, Close Button */}
            <div 
              id="chat-header" 
              className="p-4 border-b border-black/5 flex items-center justify-between bg-white/20"
            >
              <div className="flex items-center gap-2.5">
                {chatView === "chat" && (
                  <button
                    onClick={() => setChatView("dashboard")}
                    className="p-1.5 rounded-lg hover:bg-black/5 text-slate-700 transition-all cursor-pointer mr-0.5 border-none bg-transparent flex items-center justify-center"
                    aria-label="Back to Dashboard"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                {/* Logo */}
                <div id="chat-logo" className="w-9 h-9 bg-[#8B5CF6] rounded-xl flex items-center justify-center text-white font-black text-xs tracking-tighter shadow-md shadow-purple-600/20">
                  PV7
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 tracking-tight leading-tight">
                    PV7 Assistant
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  id="close-chat-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-black/5 transition-all cursor-pointer border-none bg-transparent flex items-center justify-center"
                  aria-label="Close Chat"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Dashboard View */}
            {chatView === "dashboard" ? (
              <div id="dashboard-view" className="flex-1 overflow-y-auto p-4 space-y-6 select-none bg-transparent scrollbar-thin">
                {/* SECTION 1: GREETING CARD */}
                <motion.div
                  id="greeting-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="p-6 rounded-[28px] border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.03)] flex flex-col justify-center text-left"
                  style={{
                    background: "rgba(255, 255, 255, 0.45)",
                    backdropFilter: "blur(30px)",
                    WebkitBackdropFilter: "blur(30px)",
                  }}
                >
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                    Hi! I'm PV7 Assistant.
                  </h2>
                  <p className="text-sm text-slate-700 font-medium mt-1 leading-relaxed">
                    How can I help you today?
                  </p>
                </motion.div>

                {/* SECTION 2: POPULAR QUESTIONS */}
                <div id="popular-questions" className="space-y-4">
                  <h3 className="text-[20px] font-bold text-[#7c3aed] tracking-tight pl-1">
                    Popular Questions
                  </h3>
                  
                  <div className="space-y-3">
                    {[
                      "What is PV7-Provahan?",
                      "What types of vehicles are supported?",
                      "Is it safe to use?",
                      "Does PV7-Provahan verify documents?",
                      "How do I contact support?"
                    ].map((faq, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleInteract(faq)}
                        className="w-full h-16 px-4 rounded-[20px] border border-white/45 flex items-center justify-between text-left cursor-pointer transition-all bg-transparent outline-none"
                        style={{
                          background: "rgba(255, 255, 255, 0.35)",
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                        }}
                        whileHover={{ 
                          scale: 1.02, 
                          background: "rgba(255, 255, 255, 0.55)",
                          borderColor: "rgba(124, 58, 237, 0.4)",
                          boxShadow: "0 0 15px rgba(124, 58, 237, 0.15)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <span className="text-xs font-semibold text-slate-800 pr-2 line-clamp-2 leading-snug">
                          {faq}
                        </span>
                        <ChevronRight size={16} className="text-[#7c3aed] shrink-0" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* SECTION 3: QUICK ACTION GRID */}
                <div id="quick-action-grid" className="grid grid-cols-2 gap-3.5 pt-1">
                  {[
                    {
                      id: "whatsapp",
                      title: "Ask on\nWhatsApp",
                      icon: <MessageCircle size={22} className="text-[#25D366]" />,
                      iconBg: "bg-[#25D366]/10 border border-[#25D366]/20",
                    },
                    {
                      id: "callback",
                      title: "Request\nCallback",
                      icon: <PhoneCall size={20} className="text-[#8B5CF6]" />,
                      iconBg: "bg-[#8B5CF6]/10 border border-[#8B5CF6]/20",
                    },
                    {
                      id: "mail",
                      title: "Mail Us",
                      icon: <Mail size={20} className="text-[#8B5CF6]" />,
                      iconBg: "bg-[#8B5CF6]/10 border border-[#8B5CF6]/20",
                    },
                    {
                      id: "explore",
                      title: "Explore\nServices",
                      icon: <LayoutGrid size={20} className="text-[#8B5CF6]" />,
                      iconBg: "bg-[#8B5CF6]/10 border border-[#8B5CF6]/20",
                    }
                  ].map((action, index) => (
                    <motion.button
                      key={action.id}
                      onClick={() => handleInteract(action.title.replace("\n", " "))}
                      className="h-[115px] p-4 rounded-[22px] border border-white/45 flex flex-col justify-between items-start text-left cursor-pointer transition-all bg-transparent outline-none"
                      style={{
                        background: "rgba(255, 255, 255, 0.35)",
                        backdropFilter: "blur(25px)",
                        WebkitBackdropFilter: "blur(25px)",
                      }}
                      whileHover={{ 
                        scale: 1.03, 
                        background: "rgba(255, 255, 255, 0.55)",
                        borderColor: "rgba(124, 58, 237, 0.4)",
                        boxShadow: "0 0 18px rgba(124, 58, 237, 0.12)"
                      }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 + index * 0.05, duration: 0.3 }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action.iconBg}`}>
                        {action.icon}
                      </div>
                      <span className="text-[12px] font-bold text-slate-800 leading-tight whitespace-pre-line tracking-tight">
                        {action.title}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              /* Active Chat Area */
              <div id="chat-messages" className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent select-text relative">
                {/* Messages Content Wrapper */}
                <div className="relative z-10 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${
                        msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                      }`}
                    >
                      <div
                        className={`p-3.5 rounded-2xl text-[13.5px] leading-relaxed whitespace-pre-line shadow-sm ${
                          msg.sender === "user"
                            ? "text-white rounded-tr-none font-medium"
                            : "text-slate-800 rounded-tl-none border border-white/45"
                        }`}
                        style={
                          msg.sender === "user"
                            ? {
                                background: "linear-gradient(135deg, #7b2ff7, #9f44ff)",
                              }
                            : {
                                background: "rgba(255, 255, 255, 0.55)",
                                backdropFilter: "blur(20px)",
                                WebkitBackdropFilter: "blur(20px)",
                              }
                        }
                      >
                        {msg.text}
                      </div>
                      {/* Time Stamp */}
                      <span className="text-[9.5px] font-semibold mt-1.5 px-1.5 tracking-wider uppercase text-slate-500">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}

            {/* Input Area */}
            <form 
              id="chat-input-form" 
              onSubmit={handleSendMessage} 
              className="p-3 border-t border-black/5 flex gap-2 bg-white/20"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Message PV7 Assistant..."
                className="flex-1 bg-white/45 hover:bg-white/55 focus:bg-white/65 border border-white/50 outline-none rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:ring-1 focus:ring-[#8B5CF6]/30 transition-all"
              />
              <button
                type="submit"
                className="w-11 h-11 bg-[#8B5CF6] hover:bg-[#7c4df2] active:bg-[#6c3de2] text-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all border-none"
                aria-label="Send Message"
              >
                <Send size={18} strokeWidth={2} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        id="floating-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(123,47,247,0.4)] cursor-pointer outline-none focus:ring-4 focus:ring-purple-300 transition-all border-none z-50"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        aria-label={isOpen ? "Close Chat" : "Open Chat"}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {isOpen ? <X size={28} strokeWidth={2.5} /> : <MessageSquare size={28} strokeWidth={2.5} />}
        </motion.div>
      </motion.button>

      {/* Draggable Dinosaur Web Pet */}
      <motion.div
        id="dino-pet"
        drag
        dragMomentum={false}
        className={`fixed z-50 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center select-none ${pages[currentPageIndex].dinoClass}`}
        style={{
          bottom: "32px",
          left: "32px",
          touchAction: "none"
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95, cursor: "grabbing" }}
        onClick={() => {
          setDinoMsgIndex((prev) => (prev + 1) % dinoMessages.length);
        }}
      >
        {/* Talk Box */}
        <div className="relative mb-3 bg-white text-slate-900 border border-slate-200 shadow-2xl py-2 px-3.5 rounded-2xl w-44 text-center text-[10px] font-extrabold leading-snug select-none pointer-events-none">
          {dinoMessages[dinoMsgIndex]}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2.5 h-2.5 rotate-45 bg-white border-r border-b border-slate-200" />
        </div>

        {/* Dinosaur Solid 2D Figure */}
        <div className="flex flex-col items-center">
          <DinosaurSVG />
        </div>
      </motion.div>
    </div>
  );
}
