import { config } from 'dotenv';
import { resolve } from 'node:path';
import { createApp } from './app.js';
import { getApiEnvironment } from './config/env.js';
import { disconnectPrismaClient } from './db/client.js';
import { createLogger } from './logging/logger.js';

config({ path: resolve(process.cwd(), '../../.env') });

const environment = getApiEnvironment();
const logger = createLogger();
const app = createApp({ logger });
const server = app.listen(environment.API_PORT, '0.0.0.0', () => {
  logger.info({ port: environment.API_PORT }, 'API server listening');
});

let shuttingDown = false;

function shutdown(signal: string): void {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  logger.info({ signal }, 'API server shutting down');

  server.close(() => {
    void disconnectPrismaClient()
      .then(() => {
        process.exitCode = 0;
      })
      .catch((error: unknown) => {
        logger.error({ err: error }, 'failed to close database connections');
        process.exitCode = 1;
      });
  });
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
