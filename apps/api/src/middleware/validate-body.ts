import type { RequestHandler } from 'express';
import { z } from 'zod';
import { HttpError } from '../errors/http-error.js';

export function validateBody<TBody>(schema: z.ZodType<TBody>): RequestHandler {
  return (request, response, next) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      next(
        new HttpError(
          400,
          'INVALID_REQUEST_BODY',
          'Request body validation failed.',
          result.error.issues.map((issue) => ({
            path: issue.path.map(String),
            message: issue.message,
          })),
        ),
      );
      return;
    }

    response.locals.validatedBody = result.data;
    next();
  };
}
