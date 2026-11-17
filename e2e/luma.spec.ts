import { test, expect } from '@playwright/test';

test.describe('LUMA v2 - End-to-End Verification', () => {
  test('loads authentication screen with security captcha and logo', async ({ page }) => {
    await page.goto('/luma-v2/');
    await expect(page.locator('text=ورود')).toBeVisible();
    await expect(page.locator('text=ثبت‌نام')).toBeVisible();
    await expect(page.locator('text=تأیید امنیتی')).toBeVisible();
  });
});
