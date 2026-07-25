import { test, expect } from '@playwright/test';

test.describe('Portfolio Homepage', () => {
  test('should load the homepage and check title', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Expect the page to have the Next.js standard title or custom title
    await expect(page).toHaveTitle(/Create Next App|Portfolio/);
    
    // We render "Hero section not configured yet" or the actual Hero name
    // Just verify the page loaded without a 500 error
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
  
  test('system console login page should render', async ({ page }) => {
    await page.goto('/system-console/login');
    
    // Verify login form is visible
    const heading = page.getByRole('heading', { name: /System Console/i });
    await expect(heading).toBeVisible();
    
    const emailInput = page.getByLabel(/Email/i);
    await expect(emailInput).toBeVisible();
    
    const loginButton = page.getByRole('button', { name: /Login/i });
    await expect(loginButton).toBeVisible();
  });
});
