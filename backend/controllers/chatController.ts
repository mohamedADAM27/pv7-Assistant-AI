import { Request, Response, NextFunction } from "express";
import { searchVectorStore } from "../utils/vectorStore.ts";
import { generateChatStream } from "../services/gemini.ts";
import { Message } from "../types/index.ts";

export async function chatHandler(req: Request, res: Response, next: NextFunction) {
  const { message } = req.body;
  const session = req.sessionData;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required and must be a string." });
  }

  // If session is somehow not loaded, initialize a fallback history
  const history: Message[] = session ? session.history : [];

  console.log(`[ChatController] Processing message: "${message.substring(0, 60)}${message.length > 60 ? "..." : ""}" (Session: ${session?.id || "none"})`);

  try {
    // 1. Retrieve top-K relevant chunks from vector store using RAG similarity search
    const topChunks = await searchVectorStore(message, 4);
    
    // Log retrieved contexts for debugging and traceability
    console.log(`[ChatController] Retrieved ${topChunks.length} relevant chunks for context.`);
    topChunks.forEach((chunk, index) => {
      console.log(`  Chunk ${index + 1}: (Score similarity index: ${chunk.metadata.index}) - ${chunk.text.substring(0, 100)}...`);
    });

    let contextText = topChunks.map((c) => c.text).join("\n\n");
    
    // Fallback: if no chunks found, provide basic company info
    if (topChunks.length === 0) {
      console.warn("[ChatController] No matching chunks found. Using fallback knowledge...");
      contextText = `PV7-Provahan is a technology-driven company transforming India's used vehicle industry. 
The platform offers vehicle listings, inspection services, history verification, insurance integration, finance options, spare parts marketplace, and dealer support. 
The company is committed to transparency, innovation, and customer-centric digital experiences.
Contact Information: info@provahan.com or call support team during business hours.
For any specific information not provided, please contact our support team for further assistance.`;
    }
    
    const historyText = history
      .map((h) => `${h.role === "user" ? "User" : "Assistant"}: ${h.text}`)
      .join("\n");

    // 2. Formulate system instruction and user prompt matching prototype rules
    const systemInstruction = `You are PV7 Assistant, a friendly and highly knowledgeable customer support representative for PV7-Provahan.

Your goal is to answer user queries accurately and helpfully based on the provided PV7-Provahan Knowledge Base context.

Rules:
1. Use the provided context to answer questions about PV7-Provahan company, services, team, contact info, processes, and more.
2. Answer thoroughly, politely, and professionally. Be direct and helpful.
3. If the user paraphrases questions (e.g., asking for "CEO", "head", "timings", "hours", "fee", "how long", "where is office"), provide the corresponding answers from context.
4. If the exact answer isn't in the provided context, use your general knowledge about PV7-Provahan and vehicle industry, then suggest contacting support for more specific details.
5. Always be helpful - never give blank or dismissive responses.
6. DO NOT use markdown bold/asterisks (** or *) in your response. Speak in clean, plain text with normal capitalization and standard punctuation.
7. If a question is completely unrelated to PV7-Provahan (like "What is the weather?"), politely redirect the conversation.`;

    const prompt = `Below is the context retrieved from the official PV7-Provahan Knowledge Base and the recent conversation history. Answer the user's question using only the facts inside the context. Do not hallucinate any information.

--- START CONTEXT ---
${contextText}
--- END CONTEXT ---

--- START CONVERSATION HISTORY ---
${historyText}
--- END CONVERSATION HISTORY ---

User Question: ${message}`;

    // 3. Setup Response headers for chunked HTTP streaming
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponseText = "";

    // 4. Stream response from Gemini
    await generateChatStream(prompt, systemInstruction, (chunk) => {
      // Clean up markdown bold markers if any were generated in spite of prompt instructions
      const cleanChunk = chunk.replace(/\*/g, "");
      fullResponseText += cleanChunk;
      res.write(cleanChunk);
    });

    res.end();

    // 5. Update session conversation history
    if (session) {
      session.history.push({ role: "user", text: message, timestamp: new Date().toISOString() });
      session.history.push({ role: "model", text: fullResponseText, timestamp: new Date().toISOString() });
      
      // Limit history length to prevent token overflow (keep last 12 messages)
      if (session.history.length > 12) {
        session.history = session.history.slice(session.history.length - 12);
      }
    }
  } catch (err: any) {
    console.error("[ChatController] Error during RAG streaming:", err);
    
    if (!res.headersSent) {
      next(err);
    } else {
      res.write("\n\nPlease contact our support team for further assistance.");
      res.end();
    }
  }
}
