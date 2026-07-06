export interface Message {
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface Session {
  id: string;
  history: Message[];
  createdAt: number;
  lastActive: number;
}

export interface Chunk {
  id: string;
  text: string;
  embedding: number[];
  metadata: {
    source: string;
    index: number;
  };
}

export interface CachedEmbedding {
  id: string;
  text: string;
  embedding: number[];
  source: string;
  index: number;
}

export interface EmbedCacheData {
  pdfHash: string;
  chunks: CachedEmbedding[];
}
