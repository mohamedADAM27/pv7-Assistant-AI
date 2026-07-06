import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Chunk, EmbedCacheData } from "../types/index.ts";
import { generateEmbedding } from "../services/gemini.ts";

let vectorStore: Chunk[] = [];

// Compute MD5 hash of a file to check for changes
function getFileHash(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  const hash = crypto.createHash("md5");
  hash.update(fileBuffer);
  return hash.digest("hex");
}

// Split text into overlapping paragraphs or size-based blocks
export function chunkText(text: string, maxChunkSize: number = 800, overlapSize: number = 200): string[] {
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  
  const chunks: string[] = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length <= maxChunkSize) {
      currentChunk += (currentChunk ? "\n" : "") + paragraph;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      
      // If the paragraph itself is longer than maxChunkSize, split it by characters
      if (paragraph.length > maxChunkSize) {
        let temp = paragraph;
        while (temp.length > 0) {
          const part = temp.substring(0, maxChunkSize);
          chunks.push(part);
          temp = temp.substring(maxChunkSize - overlapSize);
          if (temp.length <= overlapSize) break;
        }
        currentChunk = "";
      } else {
        // Setup next chunk with overlap from the end of currentChunk if possible
        const overlapStart = Math.max(0, currentChunk.length - overlapSize);
        const overlapText = currentChunk.substring(overlapStart);
        currentChunk = overlapText + "\n" + paragraph;
      }
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

// Compute cosine similarity between two numeric vectors
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Initialize vector store from PDF (with local JSON cache)
export async function initializeVectorStore(pdfPath: string): Promise<void> {
  const cachePath = path.join(process.cwd(), ".embeddings_cache.json");
  const pdfHash = getFileHash(pdfPath);
  const sourceName = path.basename(pdfPath);

  // Try loading from cache
  if (fs.existsSync(cachePath)) {
    try {
      const cacheRaw = fs.readFileSync(cachePath, "utf-8");
      const cacheData: EmbedCacheData = JSON.parse(cacheRaw);
      
      if (cacheData.pdfHash === pdfHash) {
        console.log(`[VectorStore] Cache match found for ${sourceName}. Loading embeddings from cache...`);
        vectorStore = cacheData.chunks.map((item) => ({
          id: item.id,
          text: item.text,
          embedding: item.embedding,
          metadata: {
            source: item.source,
            index: item.index,
          },
        }));
        console.log(`[VectorStore] Loaded ${vectorStore.length} chunks from cache successfully.`);
        console.log("Embeddings Loaded");
        return;
      }
    } catch (err) {
      console.warn("[VectorStore] Failed to read embeddings cache. Re-generating embeddings...", err);
    }
  }

  // Parse and generate new embeddings if cache is invalid or missing
  console.log(`[VectorStore] Cache miss or invalid for ${sourceName}. Parsing PDF...`);
  const { parsePdf } = await import("./pdfParser.ts");
  const fullText = await parsePdf(pdfPath);
  
  console.log("[VectorStore] Chunking text...");
  const textChunks = chunkText(fullText, 800, 200);
  console.log(`Chunks Created: ${textChunks.length}`);
  console.log(`[VectorStore] Created ${textChunks.length} chunks. Generating embeddings...`);

  vectorStore = [];
  for (let i = 0; i < textChunks.length; i++) {
    const chunkText = textChunks[i];
    try {
      console.log(`[VectorStore] Generating embedding for chunk ${i + 1}/${textChunks.length}...`);
      const embedding = await generateEmbedding(chunkText);
      
      vectorStore.push({
        id: `${pdfHash}-${i}`,
        text: chunkText,
        embedding,
        metadata: {
          source: sourceName,
          index: i,
        },
      });
    } catch (err: any) {
      console.error(`[VectorStore] Failed to generate embedding for chunk ${i}:`, err.message || err);
      console.warn("[VectorStore] Continuing with remaining chunks...");
      // Continue instead of throwing to allow partial initialization
    }
  }

  console.log("Embeddings Loaded");

  // Save to cache file
  try {
    const cacheData: EmbedCacheData = {
      pdfHash,
      chunks: vectorStore.map((chunk) => ({
        id: chunk.id,
        text: chunk.text,
        embedding: chunk.embedding,
        source: chunk.metadata.source,
        index: chunk.metadata.index,
      })),
    };
    fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2), "utf-8");
    console.log(`[VectorStore] Saved ${vectorStore.length} chunks and embeddings to local cache.`);
  } catch (err) {
    console.error("[VectorStore] Failed to save embeddings cache:", err);
  }
}

// Search vector store for top-K matches
export async function searchVectorStore(query: string, topK: number = 3): Promise<Chunk[]> {
  if (vectorStore.length === 0) {
    console.warn("[VectorStore] Search query received but vector store is empty.");
    return [];
  }

  const queryEmbedding = await generateEmbedding(query);
  
  const scoredChunks = vectorStore.map((chunk) => {
    const score = cosineSimilarity(queryEmbedding, chunk.embedding);
    return { chunk, score };
  });

  // Sort by score descending and return top K
  scoredChunks.sort((a, b) => b.score - a.score);
  
  const results = scoredChunks.slice(0, topK).map((item) => item.chunk);
  
  console.log(`[VectorStore] Retrieval matching complete. Top score: ${scoredChunks[0]?.score.toFixed(4) || 0}`);
  
  return results;
}
