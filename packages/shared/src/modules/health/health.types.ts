import type { HealthResponseSchema, ReadinessResponseSchema } from './health.schemas.js';
import type { z } from 'zod';

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export type ReadinessResponse = z.infer<typeof ReadinessResponseSchema>;
