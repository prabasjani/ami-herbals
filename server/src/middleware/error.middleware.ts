import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import { AppError } from "../common/errors/app-error.js";
import { logger } from "../common/logger/logger.js";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.error(err);

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues,
    });

    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
