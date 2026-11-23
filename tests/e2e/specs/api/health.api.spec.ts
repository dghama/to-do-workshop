import { expect, test } from '../../src/fixtures/test.js';
import { createHealthResponse } from '../../src/factories/health-response.factory.js';
import { readApiSuccess } from '../../src/utils/read-api-success.js';

test('serves API liveness with a request identifier', async ({ healthApi }) => {
  const response = await test.step('Request API liveness', () => healthApi.getLiveness());

  expect(response.ok()).toBe(true);
  expect(await readApiSuccess(response)).toEqual({ data: createHealthResponse() });
  expect(response.headers()['x-request-id']).toBeTruthy();
});
