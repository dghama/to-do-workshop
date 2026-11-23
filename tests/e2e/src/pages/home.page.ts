import { expect, type Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async expectReady(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: 'Ready for the next specification' }),
    ).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'To-Do Workshop home' })).toBeVisible();
  }
}
