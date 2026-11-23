import type { Page } from '@playwright/test';
import { API_BASE_URL } from '../constants/urls.js';

export type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export class ApiMock {
  constructor(private readonly page: Page) {}

  async respond(path: string, body: JsonValue, status = 200): Promise<void> {
    await this.page.route(new URL(path, API_BASE_URL).toString(), (route) =>
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(body),
      }),
    );
  }
}
