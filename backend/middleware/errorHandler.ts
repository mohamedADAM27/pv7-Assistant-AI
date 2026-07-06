import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
  status?: number;
  statusCode?: number;
}

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[Error Handler] Caught error:`, err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || "An unexpected error occurred.";

  res.status(status).json({
    error: {
      message,
      status,
      timestamp: new Date().toISOString(),
    },
  });
}
