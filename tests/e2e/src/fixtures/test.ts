import { test as base, expect } from '@playwright/test';
import { HealthApiClient } from '../api/health-api.client.js';
import { API_BASE_URL } from '../constants/urls.js';
import { ApiMock } from '../mocks/api.mock.js';
import { HomePage } from '../pages/home.page.js';

type TestFixtures = {
  apiMock: ApiMock;
  healthApi: HealthApiClient;
  homePage: HomePage;
};

export const test = base.extend<TestFixtures>({
  apiMock: async ({ page }, use) => {
    await use(new ApiMock(page));
  },
  healthApi: async ({ request }, use) => {
    await use(new HealthApiClient(request, API_BASE_URL));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export { expect };
