import {
  HealthResponseSchema,
  ReadinessResponseSchema,
  type HealthResponse,
  type ReadinessResponse,
} from '@todo/shared';
import type { HealthService } from './health.types.js';

export function createHealthService(checkDatabase: () => Promise<void>): HealthService {
  return {
    getLiveness(): HealthResponse {
      return HealthResponseSchema.parse({ status: 'ok', service: 'api' });
    },
    async checkReadiness(): Promise<ReadinessResponse> {
      await checkDatabase();
      return ReadinessResponseSchema.parse({ status: 'ready' });
    },
  };
}
