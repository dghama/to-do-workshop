import pino from 'pino';
import request from 'supertest';
import { createApp } from '../../../app.js';

describe('health module routes', () => {
  it('exposes liveness with standard request and security headers', async () => {
    const app = createApp({ logger: pino({ enabled: false }) });
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({ status: 'ok', service: 'api' });
    expect(response.headers['x-request-id']).toBeDefined();
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });

  it('reports database readiness failures without exposing internal errors', async () => {
    const app = createApp({
      logger: pino({ enabled: false }),
      checkDatabase: async () => {
        throw new Error('database is not configured in this test');
      },
    });
    const response = await request(app).get('/api/v1/health/ready');

    expect(response.status).toBe(503);
    expect(response.body.error).toMatchObject({
      code: 'DATABASE_UNAVAILABLE',
      message: 'The database is unavailable.',
    });
    expect(response.body.error.requestId).toBe(response.headers['x-request-id']);
    expect(JSON.stringify(response.body)).not.toContain('database is not configured');
  });

  it('reports readiness when the injected database check succeeds', async () => {
    const app = createApp({
      logger: pino({ enabled: false }),
      checkDatabase: async () => {},
    });
    const response = await request(app).get('/api/v1/health/ready');

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({ status: 'ready' });
  });
});
