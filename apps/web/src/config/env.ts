import { z } from 'zod';

const webEnvironmentSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
});

export type WebEnvironment = {
  apiBaseUrl: string;
};

export function parseWebEnvironment(environment: unknown): WebEnvironment {
  const result = webEnvironmentSchema.safeParse(environment);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');

    throw new Error(`Invalid frontend environment: ${details}`);
  }

  return {
    apiBaseUrl: result.data.VITE_API_BASE_URL.replace(/\/+$/, ''),
  };
}
