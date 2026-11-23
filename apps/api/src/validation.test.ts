import express from 'express';
import pino from 'pino';
import request from 'supertest';
import { PaginationQuerySchema } from '@todo/shared';
import { createErrorHandler } from './middleware/error-handler.js';
import { requestIdMiddleware } from './middleware/request-id.js';
import { validateBody } from './middleware/validate-body.js';

describe('request body validation', () => {
  const app = express();
  const logger = pino({ enabled: false });

  app.use(requestIdMiddleware);
  app.use(express.json());
  app.post('/validation', validateBody(PaginationQuerySchema), (_request, response) => {
    response.status(200).json({ data: response.locals.validatedBody });
  });
  app.use(createErrorHandler(logger));

  it('rejects invalid request bodies with a structured 400 response', async () => {
    const response = await request(app).post('/validation').send({ limit: 0 });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_REQUEST_BODY');
    expect(response.body.error.details).toHaveLength(1);
    expect(response.headers['x-request-id']).toBeDefined();
  });

  it('stores the parsed, coerced request body for downstream handlers', async () => {
    const response = await request(app).post('/validation').send({ limit: '12' });

    expect(response.status).toBe(200);
    expect(response.body.data.limit).toBe(12);
  });
});
