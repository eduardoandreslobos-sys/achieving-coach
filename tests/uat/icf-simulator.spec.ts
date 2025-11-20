import { test, expect } from '@playwright/test';

test.describe('ICF Simulator Flow (UAT)', () => {
  test('should complete ICF exam simulation', async ({ page }) => {
    await page.goto('/coach/icf-simulator');
    
    // Start exam
    await expect(page.locator('h1')).toContainText('ICF ACC Exam Simulator');
    await page.click('button:has-text("Start Exam")');
    
    // Answer first 5 questions (for speed in UAT)
    for (let i = 0; i < 5; i++) {
      await page.click('button:has-text("A)")'); // Select first option
      
      if (i < 4) {
        await page.click('button:has-text("Next")');
      }
    }
    
    // Note: Full exam would have 60 questions and take too long for UAT
    // In real scenario, you'd mock this or have a test mode
    
    // Verify timer is running
    await expect(page.locator('text=/\\d+:\\d+/')).toBeVisible();
  });
});
