import type { Logger } from 'pino';
import type { HealthResponse, ReadinessResponse } from '@todo/shared';

export type HealthService = {
  getLiveness(): HealthResponse;
  checkReadiness(): Promise<ReadinessResponse>;
};

export type HealthRouterDependencies = {
  service: HealthService;
  logger: Logger;
};
