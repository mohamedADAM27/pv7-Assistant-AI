import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env with explicit path
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export interface Env {
  GEMINI_API_KEY: string;
  PORT: number;
  APP_URL: string;
  NODE_ENV: string;
}

const getEnvOrThrow = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    console.error(`❌ [Error] Environment variable ${key} is not set!`);
    console.error(`📝 Please add ${key} to your .env file`);
    console.error(`🔗 Get your Gemini API key from: https://ai.google.dev/`);
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env: Env = {
  GEMINI_API_KEY: getEnvOrThrow("GEMINI_API_KEY"),
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  APP_URL: process.env.APP_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
};
