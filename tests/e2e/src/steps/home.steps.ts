import { test } from '@playwright/test';
import type { HomePage } from '../pages/home.page.js';

export async function openWorkshopHome(homePage: HomePage): Promise<void> {
  await test.step('Open the workshop home page', () => homePage.open());
  await test.step('Verify the application shell', () => homePage.expectReady());
}
