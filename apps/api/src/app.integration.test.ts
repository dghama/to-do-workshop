import pino from 'pino';
import request from 'supertest';
import { createApp } from './app.js';

describe('API foundation', () => {
  const app = createApp({ logger: pino({ enabled: false }) });

  it('returns a structured 404 response for unknown routes', async () => {
    const response = await request(app).get('/api/v1/unknown');

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});
