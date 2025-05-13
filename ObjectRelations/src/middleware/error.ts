import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

/**
 * Global error‑handling middleware.
 * Converts Zod validation errors, Prisma known request errors,
 * and generic errors into a JSON payload: { status, message }.
 */
const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let status = 500;
  let message = 'Internal Server Error';

  if (err instanceof ZodError) {
    status = 422;
    message = err.errors
      .map((e) => (e.path.length ? `${e.path.join('.')} - ${e.message}` : e.message))
      .join('; ');
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Map some common Prisma error codes to HTTP statuses
    switch (err.code) {
      case 'P2002': // Unique constraint failed
        status = 409;
        break;
      case 'P2025': // Record not found
        status = 404;
        break;
      default:
        status = 400;
    }
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(status).json({ status, message });
};

export default errorHandler;
