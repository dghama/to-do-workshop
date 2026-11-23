import { ApiErrorResponseSchema, ApiSuccessResponseSchema } from '@todo/shared';
import { z } from 'zod';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly requestId: string | undefined;

  constructor(message: string, status: number, code?: string, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.requestId = requestId;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
};

type FetchImplementation = (input: URL, init?: RequestInit) => Promise<Response>;

export function createApiClient(
  baseUrl: string,
  fetchImplementation: FetchImplementation = globalThis.fetch,
) {
  if (typeof fetchImplementation !== 'function') {
    throw new TypeError('A Fetch API implementation is required.');
  }

  const normalizedBaseUrl = `${baseUrl.replace(/\/+$/, '')}/`;

  return {
    async request<TResponse>(
      path: string,
      responseSchema: z.ZodType<TResponse>,
      { method = 'GET', body, signal }: RequestOptions = {},
    ): Promise<TResponse | null> {
      const url = new URL(path.replace(/^\/+/, ''), normalizedBaseUrl);
      const response = await fetchImplementation(url, {
        method,
        headers: {
          Accept: 'application/json',
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        ...(signal === undefined ? {} : { signal }),
      });

      if (response.status === 204) {
        return null;
      }

      const payload: unknown = await response.json();

      if (!response.ok) {
        const parsedError = ApiErrorResponseSchema.safeParse(payload);
        const error = parsedError.success ? parsedError.data.error : undefined;
        throw new ApiError(
          error?.message ?? 'The request could not be completed.',
          response.status,
          error?.code,
          error?.requestId ?? response.headers.get('x-request-id') ?? undefined,
        );
      }

      const successPayload = ApiSuccessResponseSchema.parse(payload);
      return responseSchema.parse(successPayload.data);
    },
  };
}
