import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

type RequestField = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, field: RequestField = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[field]);
    if (!result.success) {
      return next(result.error);
    }
    req[field] = result.data;
    next();
  };
}
