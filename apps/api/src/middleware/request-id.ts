import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

const requestIdPattern = /^[a-zA-Z0-9._:-]{1,128}$/;

export const requestIdMiddleware: RequestHandler = (request, response, next) => {
  const incomingRequestId = request.get('x-request-id');
  const requestId =
    incomingRequestId && requestIdPattern.test(incomingRequestId)
      ? incomingRequestId
      : randomUUID();

  response.locals.requestId = requestId;
  response.setHeader('x-request-id', requestId);
  next();
};
