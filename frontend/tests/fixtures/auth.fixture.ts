import { test as base, expect, Page } from '@playwright/test';

// Test user credentials - these should be test accounts in Firebase
export const TEST_USERS = {
  coach: {
    email: process.env.TEST_COACH_EMAIL || 'test-coach@achievingcoach.com',
    password: process.env.TEST_COACH_PASSWORD || 'TestCoach123!',
  },
  coachee: {
    email: process.env.TEST_COACHEE_EMAIL || 'test-coachee@achievingcoach.com',
    password: process.env.TEST_COACHEE_PASSWORD || 'TestCoachee123!',
  },
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || 'test-admin@achievingcoach.com',
    password: process.env.TEST_ADMIN_PASSWORD || 'TestAdmin123!',
  },
};

export type UserRole = 'coach' | 'coachee' | 'admin';

// Auth helper functions
export async function login(page: Page, role: UserRole): Promise<void> {
  const user = TEST_USERS[role];

  await page.goto('/sign-in');
  await page.waitForLoadState('networkidle');

  // Fill in credentials
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);

  // Click sign in button
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL(/\/(dashboard|coach|admin)/, { timeout: 15000 });
}

export async function logout(page: Page): Promise<void> {
  // Navigate to settings or find logout button
  await page.goto('/settings');
  await page.waitForLoadState('networkidle');

  // Look for sign out button
  const signOutButton = page.locator('button:has-text("Sign Out"), button:has-text("Cerrar sesión")');
  if (await signOutButton.isVisible()) {
    await signOutButton.click();
    await page.waitForURL('/sign-in', { timeout: 10000 });
  }
}

// Extended test fixture with authentication
interface AuthFixtures {
  authenticatedPage: Page;
  coachPage: Page;
  coacheePage: Page;
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await use(page);
  },
  coachPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await login(page, 'coach');
    await use(page);
    await context.close();
  },
  coacheePage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await login(page, 'coachee');
    await use(page);
    await context.close();
  },
});

export { expect };
