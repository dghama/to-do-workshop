import type { HealthResponse } from '../types/api.js';

export function createHealthResponse(): HealthResponse {
  return {
    status: 'ok',
    service: 'api',
  };
}
