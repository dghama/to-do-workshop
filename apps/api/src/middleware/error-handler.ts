import type { ErrorRequestHandler } from 'express';
import type { Logger } from 'pino';
import { ApiErrorResponseSchema } from '@todo/shared';
import { HttpError } from '../errors/http-error.js';

export function createErrorHandler(logger: Logger): ErrorRequestHandler {
  return (error: unknown, request, response, next) => {
    if (response.headersSent) {
      next(error);
      return;
    }

    const isMalformedJson = error instanceof SyntaxError && 'body' in error;
    const statusCode = error instanceof HttpError ? error.statusCode : isMalformedJson ? 400 : 500;
    const code =
      error instanceof HttpError
        ? error.code
        : isMalformedJson
          ? 'INVALID_JSON'
          : 'INTERNAL_SERVER_ERROR';
    const message =
      error instanceof HttpError
        ? error.message
        : isMalformedJson
          ? 'The request body contains invalid JSON.'
          : 'An unexpected error occurred.';
    const details = error instanceof HttpError ? error.details : undefined;

    if (statusCode >= 500) {
      logger.error({ err: error, requestId: response.locals.requestId }, 'request failed');
    } else {
      logger.warn({ err: error, requestId: response.locals.requestId }, 'request rejected');
    }

    const payload = ApiErrorResponseSchema.parse({
      error: {
        code,
        message,
        requestId: response.locals.requestId,
        ...(details === undefined ? {} : { details }),
      },
    });

    response.status(statusCode).json(payload);
  };
}
