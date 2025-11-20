import { test, expect } from '@playwright/test';

test.describe('Coach Assigns Tool to Coachee (UAT)', () => {
  test('should complete tool assignment flow', async ({ page }) => {
    await page.goto('/coach/tools');
    
    // View available tools
    await expect(page.locator('text=Wheel of Life')).toBeVisible();
    await expect(page.locator('text=Values Clarification')).toBeVisible();
    
    // Click assign on Wheel of Life
    await page.locator('[data-tool="wheel-of-life"]').locator('button:has-text("Assign")').click();
    
    // Select client from modal
    await expect(page.locator('text=Select Client')).toBeVisible();
    await page.click('text=Test Coachee');
    
    // Verify redirect to assignment page
    await expect(page).toHaveURL(/.*assign-tools/);
    
    // Complete assignment
    await page.check('input[value="wheel-of-life"]');
    await page.fill('textarea[name="instructions"]', 'Please complete this by Friday');
    await page.click('button:has-text("Assign Tool")');
    
    // Verify success
    await expect(page.locator('text=Tool assigned successfully')).toBeVisible();
  });
});
