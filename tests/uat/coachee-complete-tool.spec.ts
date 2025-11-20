import { test, expect } from '@playwright/test';

test.describe('Coachee Completes Tool (UAT)', () => {
  test('should complete Wheel of Life assessment', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Navigate to assigned tools
    await page.click('text=My Tools');
    
    // Click on Wheel of Life
    await page.click('text=Wheel of Life');
    
    // Fill out the assessment
    const areas = ['career', 'finance', 'health', 'relationships', 'personal', 'fun', 'environment', 'spirituality'];
    
    for (const area of areas) {
      await page.locator(`input[data-area="${area}"]`).fill('7');
    }
    
    // Save results
    await page.click('button:has-text("Save Results")');
    
    // Verify success
    await expect(page.locator('text=Results saved successfully')).toBeVisible();
    
    // Verify chart is displayed
    await expect(page.locator('canvas')).toBeVisible();
  });
});
