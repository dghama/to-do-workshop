import cors from 'cors';
import express, { type Express, type RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import type { Logger } from 'pino';
import { API_PREFIX } from '@todo/shared';
import { getApiEnvironment } from './config/env.js';
import { getPrismaClient } from './db/client.js';
import { HttpError } from './errors/http-error.js';
import { createErrorHandler } from './middleware/error-handler.js';
import { requestIdMiddleware } from './middleware/request-id.js';
import { createLogger } from './logging/logger.js';
import { createHealthRouter } from './modules/health/health.routes.js';
import { createHealthService } from './modules/health/health.service.js';

export type AppDependencies = {
  logger?: Logger;
  checkDatabase?: () => Promise<void>;
};

const notFoundHandler: RequestHandler = (_request, _response, next) => {
  next(new HttpError(404, 'NOT_FOUND', 'The requested resource was not found.'));
};

async function checkDatabaseConnection(): Promise<void> {
  await getPrismaClient().$queryRaw`SELECT 1`;
}

export function createApp(dependencies: AppDependencies = {}): Express {
  const environment = getApiEnvironment();
  const logger = dependencies.logger ?? createLogger();
  const checkDatabase = dependencies.checkDatabase ?? checkDatabaseConnection;
  const app = express();

  app.disable('x-powered-by');
  app.use(requestIdMiddleware);
  app.use((request, response, next) => {
    response.on('finish', () => {
      logger.info(
        {
          method: request.method,
          path: request.path,
          statusCode: response.statusCode,
          requestId: response.locals.requestId,
        },
        'request completed',
      );
    });
    next();
  });
  app.use(helmet());
  app.use(cors({ origin: environment.WEB_ORIGIN }));
  app.use(express.json({ limit: '1mb' }));
  app.use(
    API_PREFIX,
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      handler: (_request, response) => {
        response.status(429).json({
          error: {
            code: 'RATE_LIMITED',
            message: 'Too many requests. Try again later.',
            requestId: response.locals.requestId,
          },
        });
      },
    }),
  );

  app.use(API_PREFIX, createHealthRouter({ service: createHealthService(checkDatabase), logger }));

  app.use(notFoundHandler);
  app.use(createErrorHandler(logger));

  return app;
}
