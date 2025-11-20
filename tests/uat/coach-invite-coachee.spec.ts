import { test, expect } from '@playwright/test';

test.describe('Coach Invites Coachee Flow (UAT)', () => {
  let inviteLink: string;
  
  test('should allow coach to generate and share invite link', async ({ page }) => {
    // Login as coach (assume already logged in via beforeEach)
    await page.goto('/coach');
    
    // Navigate to Invite page
    await page.click('text=Invite Coachees');
    await expect(page).toHaveURL('/coach/invite');
    
    // Copy invite link
    const linkElement = await page.locator('code').first();
    inviteLink = await linkElement.textContent() || '';
    expect(inviteLink).toContain('/join/');
    
    // Click copy button
    await page.click('button:has-text("Copy")');
    await expect(page.locator('button:has-text("Copied")')).toBeVisible();
  });
  
  test('should allow coachee to sign up via invite link', async ({ page }) => {
    // Use the invite link from previous test
    // Note: In real scenario, this would be passed between tests
    await page.goto('/join/test-coach-id');
    
    // Verify coach info is shown
    await expect(page.locator('text=Join')).toBeVisible();
    
    // Sign up as coachee
    await page.fill('input[type="email"]', `coachee-${Date.now()}@example.com`);
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.click('button:has-text("Sign Up")');
    
    // Fill coachee info
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'Coachee');
    await page.click('button:has-text("Complete")');
    
    // Verify redirect to coachee dashboard
    await expect(page).toHaveURL('/dashboard');
  });
});
