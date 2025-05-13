import { ZodSchema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * validate(schema) returns an Express middleware that parses req.body
 * with the provided Zod schema.  On success, the parsed data is attached
 * to `req.validated` so downstream handlers can trust the types.
 * On failure, the ZodError is forwarded to the global error handler.
 */
export const validate = <T>(schema: ZodSchema<T>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      // Attach the parsed body for later handlers
      (req as any).validated = parsed;
      next();
    } catch (err) {
      // Forward Zod validation errors
      if (err instanceof ZodError) {
        return next(err);
      }
      return next(err as Error);
    }
  };
};
