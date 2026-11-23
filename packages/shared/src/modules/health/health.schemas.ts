import { z } from 'zod';

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.literal('api'),
});

export const ReadinessResponseSchema = z.object({
  status: z.literal('ready'),
});
