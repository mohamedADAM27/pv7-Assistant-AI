import { Router } from "express";
import { chatHandler } from "../controllers/chatController.ts";
import { rateLimiter } from "../middleware/rateLimiter.ts";
import { sessionHandler } from "../middleware/session.ts";

const router = Router();

// Endpoint for chat completions - supports both /chat and /api/chat
router.post("/chat", rateLimiter, sessionHandler, chatHandler);
router.post("/api/chat", rateLimiter, sessionHandler, chatHandler);

export default router;
