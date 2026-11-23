import { Router } from 'express';
import {
  DATABASE_UNAVAILABLE_CODE,
  DATABASE_UNAVAILABLE_MESSAGE,
  HEALTH_ROUTE,
  READINESS_ROUTE,
} from './health.constants.js';
import type { HealthRouterDependencies } from './health.types.js';

export function createHealthRouter({ service, logger }: HealthRouterDependencies): Router {
  const router = Router();

  router.get(HEALTH_ROUTE, (_request, response) => {
    response.status(200).json({ data: service.getLiveness() });
  });

  router.get(READINESS_ROUTE, async (_request, response) => {
    try {
      response.status(200).json({ data: await service.checkReadiness() });
    } catch (error) {
      logger.warn(
        { err: error, requestId: response.locals.requestId },
        'database readiness check failed',
      );
      response.status(503).json({
        error: {
          code: DATABASE_UNAVAILABLE_CODE,
          message: DATABASE_UNAVAILABLE_MESSAGE,
          requestId: response.locals.requestId,
        },
      });
    }
  });

  return router;
}
