import type { APIResponse } from '@playwright/test';
import { ApiSuccessResponseSchema, type ApiSuccessResponse } from '@todo/shared';

export async function readApiSuccess(response: APIResponse): Promise<ApiSuccessResponse> {
  return ApiSuccessResponseSchema.parse(await response.json());
}
