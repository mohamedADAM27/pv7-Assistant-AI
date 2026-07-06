import { Request, Response, NextFunction } from "express";

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const ipCache = new Map<string, RateLimitInfo>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // max 100 requests per window

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  let limitInfo = ipCache.get(ip);

  if (!limitInfo || now > limitInfo.resetTime) {
    limitInfo = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    ipCache.set(ip, limitInfo);
    return next();
  }

  limitInfo.count++;

  if (limitInfo.count > MAX_REQUESTS) {
    console.warn(`[Rate Limit] IP ${ip} exceeded request threshold (${limitInfo.count}/${MAX_REQUESTS})`);
    return res.status(429).json({
      error: {
        message: "Too many requests. Please try again later.",
        status: 429,
        timestamp: new Date().toISOString(),
      },
    });
  }

  next();
}
