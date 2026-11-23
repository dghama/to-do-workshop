import { defineConfig, devices } from '@playwright/test';
import { API_BASE_URL, WEB_BASE_URL } from './src/constants/urls.js';

export default defineConfig({
  testDir: './specs',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [
    process.env.CI ? ['github'] : ['list'],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],
  use: {
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: '**/*.api.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: WEB_BASE_URL,
      },
    },
    {
      name: 'api-smoke',
      testMatch: '**/*.api.spec.ts',
      use: {
        baseURL: API_BASE_URL,
      },
    },
  ],
  webServer: [
    {
      command: 'corepack pnpm --filter @todo/api start',
      url: `${API_BASE_URL}/api/v1/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        API_PORT: '3000',
        DATABASE_URL: 'postgresql://todo:todo@127.0.0.1:5432/todo_dev?schema=public',
        LOG_LEVEL: 'silent',
        WEB_ORIGIN: WEB_BASE_URL,
      },
    },
    {
      command: 'corepack pnpm --filter @todo/web dev -- --host 127.0.0.1',
      url: WEB_BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        VITE_API_BASE_URL: `${API_BASE_URL}/api/v1`,
      },
    },
  ],
});
