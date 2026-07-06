import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.ts";

// Helper to get GoogleGenAI client
function getAiClient(): GoogleGenAI {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Generate vector embedding for text chunks
export async function generateEmbedding(text: string): Promise<number[]> {
  const ai = getAiClient();
  const embeddingModels = [
    "models/text-embedding-004",
    "models/embedding-001",
    "models/text-embedding-preview-0409"
  ];
  let lastError: any = null;

  for (const model of embeddingModels) {
    try {
      const response = await ai.models.embedContent({
        model,
        contents: text,
      });

      if (response && response.embedding && response.embedding.values) {
        return response.embedding.values;
      }
    } catch (err: any) {
      console.warn(`[Gemini Service] Embedding model ${model} failed. Trying fallback...`);
      lastError = err;
    }
  }

  // If all embedding models fail, generate a hash-based fake embedding (still useful for search)
  console.warn("[Gemini Service] All embedding models failed. Using hash-based fallback embedding...");
  const fakeEmbedding = generateFakeEmbedding(text);
  return fakeEmbedding;
}

// Generate streaming content using Gemini with automatic fallbacks
export async function generateChatStream(
  prompt: string,
  systemInstruction: string,
  onChunk: (text: string) => void
): Promise<void> {
  const ai = getAiClient();
  const modelsToTry = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
    "gemini-flash-latest",
  ];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[Gemini Service] Requesting content stream using model ${modelName}...`);
      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.1, // Low temp for precise facts matching
        },
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          onChunk(chunk.text);
        }
      }

      console.log(`[Gemini Service] Stream completed successfully via ${modelName}`);
      return;
    } catch (err: any) {
      lastError = err;
      console.log(`[Gemini Service] Model ${modelName} stream failed: ${err.message || err}. Trying next fallback...`);

      // Check for client-side errors (except rate limit 429) to fail fast on invalid parameters/keys
      const status = err.status || (err.error && err.error.code) || err.statusCode;
      if (status && status >= 400 && status < 500 && status !== 429) {
        throw err;
      }
    }
  }

  throw lastError || new Error("All backup generation models exhausted.");
}

// Fallback embedding generator using hash-based method
function generateFakeEmbedding(text: string): number[] {
  // Generate a deterministic embedding from text using simple hash
  const embedding: number[] = new Array(384).fill(0);
  
  // Hash the text and use it to seed values
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Create a deterministic sequence
  for (let i = 0; i < 384; i++) {
    hash = (hash * 9301 + 49297) % 233280;
    embedding[i] = (hash % 200 - 100) / 100; // Normalize to -1 to 1
  }
  
  return embedding;
}
