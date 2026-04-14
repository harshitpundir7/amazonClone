import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './error-handler';

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = validated.body ?? req.body;
      req.query = validated.query ?? req.query;
      req.params = validated.params ?? req.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join('; ');
        next(new AppError(400, errors));
        return;
      }
      next(error);
    }
  };
};
