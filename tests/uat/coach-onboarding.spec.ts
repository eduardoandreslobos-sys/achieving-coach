import { test, expect } from '@playwright/test';

test.describe('Coach Onboarding Flow (UAT)', () => {
  test('should complete full coach onboarding journey', async ({ page }) => {
    // 1. Landing page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('AchievingCoach');
    
    // 2. Sign up
    await page.click('text=Sign Up');
    await page.fill('input[type="email"]', `test-coach-${Date.now()}@example.com`);
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // 3. Select role as Coach
    await expect(page).toHaveURL(/.*onboarding/);
    await page.click('text=Coach');
    
    // 4. Fill profile information
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'Coach');
    await page.fill('input[name="organization"]', 'Test Org');
    await page.click('button:has-text("Complete Setup")');
    
    // 5. Verify redirect to coach dashboard
    await expect(page).toHaveURL('/coach');
    await expect(page.locator('h1')).toContainText('Good evening, Test!');
    
    // 6. Verify trial status
    await expect(page.locator('text=14-day free trial')).toBeVisible();
  });
});
