import { Request, Response, NextFunction } from "express";
import { Session } from "../types/index.ts";

// Extend Request interface to support session
declare global {
  namespace Express {
    interface Request {
      sessionId?: string;
      sessionData?: Session;
    }
  }
}

const sessionStore = new Map<string, Session>();
const SESSION_COOKIE_NAME = "pv7_session_id";
const SESSION_TTL = 30 * 60 * 1000; // 30 minutes

// Helper to generate a unique random ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Clean up expired sessions periodically (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessionStore.entries()) {
    if (now - session.lastActive > SESSION_TTL) {
      sessionStore.delete(id);
      console.log(`[Session] Cleaned up expired session: ${id}`);
    }
  }
}, 10 * 60 * 1000);

export function sessionHandler(req: Request, res: Response, next: NextFunction) {
  // Parse cookies from headers manually if cookie-parser is not installed
  let sessionId = "";
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map(c => c.trim().split("="));
    const sessionCookie = cookies.find(([name]) => name === SESSION_COOKIE_NAME);
    if (sessionCookie) {
      sessionId = decodeURIComponent(sessionCookie[1]);
    }
  }

  // Fallback to custom header or query param just in case
  if (!sessionId) {
    sessionId = (req.headers["x-session-id"] as string) || (req.query.sessionId as string) || "";
  }

  const now = Date.now();
  let session = sessionId ? sessionStore.get(sessionId) : null;

  if (!session) {
    sessionId = generateId();
    session = {
      id: sessionId,
      history: [],
      createdAt: now,
      lastActive: now,
    };
    sessionStore.set(sessionId, session);

    // Set cookie on client
    // Set cookie options. Since we might use HTTP in dev, secure is false in dev
    const isProd = process.env.NODE_ENV === "production";
    res.cookie(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: SESSION_TTL,
    });
  } else {
    session.lastActive = now;
  }

  req.sessionId = sessionId;
  req.sessionData = session;

  next();
}
