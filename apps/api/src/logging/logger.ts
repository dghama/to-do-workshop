import pino from 'pino';
import { getApiEnvironment } from '../config/env.js';

export function createLogger() {
  return pino({
    level: getApiEnvironment().LOG_LEVEL,
    redact: {
      paths: ['req.headers.authorization', 'req.headers.cookie'],
      censor: '[Redacted]',
    },
  });
}
