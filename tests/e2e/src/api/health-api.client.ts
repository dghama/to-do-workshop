import type { APIRequestContext, APIResponse } from '@playwright/test';
import { API_HEALTH_PATH } from '@todo/shared';

export class HealthApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
  ) {}

  getLiveness(): Promise<APIResponse> {
    return this.request.get(new URL(API_HEALTH_PATH, this.baseUrl).toString());
  }
}
