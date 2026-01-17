import { Page, expect, Locator } from '@playwright/test';

/**
 * Dark theme color palette for validation
 */
export const DARK_THEME = {
  background: {
    main: 'rgb(10, 10, 10)', // #0a0a0a
    card: 'rgb(17, 17, 17)', // #111111
    input: 'rgb(26, 26, 26)', // #1a1a1a
  },
  text: {
    white: 'rgb(255, 255, 255)',
    gray400: 'rgb(156, 163, 175)',
  },
  border: {
    gray800: 'rgb(31, 41, 55)',
  },
};

/**
 * Validates that an element has dark theme styling
 */
export async function validateDarkTheme(locator: Locator): Promise<void> {
  const bgColor = await locator.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor;
  });

  // Check if background is dark (RGB values all below 50)
  const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch.map(Number);
    expect(r).toBeLessThan(50);
    expect(g).toBeLessThan(50);
    expect(b).toBeLessThan(50);
  }
}

/**
 * Validates page has dark theme background
 */
export async function validatePageDarkTheme(page: Page): Promise<void> {
  const body = page.locator('body');
  await validateDarkTheme(body);
}

/**
 * Waits for page to finish loading (no spinners)
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  // Wait for DOM content loaded first
  await page.waitForLoadState('domcontentloaded');

  // Try to wait for network idle, but don't fail if it times out
  try {
    await page.waitForLoadState('networkidle', { timeout: 10000 });
  } catch {
    // Network idle timeout is acceptable - continue with test
  }

  // Wait for any loading spinners to disappear
  const spinner = page.locator('.animate-spin');
  try {
    if (await spinner.count() > 0) {
      await spinner.first().waitFor({ state: 'hidden', timeout: 10000 });
    }
  } catch {
    // Spinner timeout is acceptable - continue with test
  }
}

/**
 * Checks if element is visible and has correct text color for dark theme
 */
export async function validateTextOnDarkTheme(locator: Locator): Promise<void> {
  await expect(locator).toBeVisible();
  const color = await locator.evaluate((el) => {
    return window.getComputedStyle(el).color;
  });

  // Check text is light colored (RGB values all above 150)
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch.map(Number);
    expect(Math.max(r, g, b)).toBeGreaterThan(150);
  }
}

/**
 * Tool IDs for testing
 */
export const TOOL_IDS = [
  'disc',
  'wheel-of-life',
  'values-clarification',
  'stakeholder-map',
  'career-compass',
  'emotional-triggers',
  'feedback-feedforward',
  'grow-model',
  'habit-loop',
  'limiting-beliefs',
  'resilience-scale',
] as const;

export type ToolId = typeof TOOL_IDS[number];

/**
 * Tool names for display validation
 */
export const TOOL_NAMES: Record<ToolId, string> = {
  'disc': 'DISC Assessment',
  'wheel-of-life': 'Wheel of Life',
  'values-clarification': 'Values Clarification',
  'stakeholder-map': 'Stakeholder Map',
  'career-compass': 'Career Compass',
  'emotional-triggers': 'Emotional Triggers Journal',
  'feedback-feedforward': 'Feedback Feed-Forward',
  'grow-model': 'GROW Worksheet',
  'habit-loop': 'Habit Loop Analyzer',
  'limiting-beliefs': 'Limiting Beliefs Transformation',
  'resilience-scale': 'Resilience Assessment Scale',
};

/**
 * Validates a card has dark theme styling
 */
export async function validateDarkCard(locator: Locator): Promise<void> {
  const bgColor = await locator.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor;
  });

  // Card should be #111111 or similar dark color
  const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch.map(Number);
    expect(r).toBeLessThan(30);
    expect(g).toBeLessThan(30);
    expect(b).toBeLessThan(30);
  }
}

/**
 * Validates button has proper dark theme styling
 */
export async function validateDarkButton(locator: Locator, variant: 'primary' | 'secondary' = 'primary'): Promise<void> {
  await expect(locator).toBeVisible();

  const bgColor = await locator.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor;
  });

  if (variant === 'primary') {
    // Primary buttons should be blue
    expect(bgColor).toMatch(/rgb\(37, 99, 235\)|rgb\(29, 78, 216\)/); // blue-600 or blue-700
  }
}

/**
 * Takes a screenshot with a descriptive name
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({
    path: `test-results/screenshots/${name}.png`,
    fullPage: true
  });
}

/**
 * Test credentials from environment
 */
export const TEST_CREDENTIALS = {
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

/**
 * Login helper - performs authentication
 * Note: Without real test credentials, login will fail and tests should handle this gracefully
 */
export async function login(
  page: Page,
  credentials: { email: string; password: string }
): Promise<boolean> {
  try {
    await page.goto('/sign-in');
    await page.waitForLoadState('domcontentloaded');

    // Wait for loading to finish and form to appear
    try {
      await page.waitForSelector('input[type="email"]', { timeout: 15000 });
    } catch {
      // Form didn't appear - might be loading or already authenticated
      console.log('Sign-in form not found - might be loading or already authenticated');
      return false;
    }

    // Fill in credentials
    await page.fill('input[type="email"]', credentials.email);
    await page.fill('input[type="password"]', credentials.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for navigation (should redirect after successful login)
    try {
      await page.waitForURL(/dashboard|coach|admin/, { timeout: 15000 });
      return true;
    } catch {
      // Login might have failed - check if still on sign-in page
      return !page.url().includes('sign-in');
    }
  } catch (error) {
    console.log('Login failed:', error);
    return false;
  }
}

/**
 * Login as coach helper
 */
export async function loginAsCoach(page: Page): Promise<boolean> {
  return login(page, TEST_CREDENTIALS.coach);
}

/**
 * Login as coachee helper
 */
export async function loginAsCoachee(page: Page): Promise<boolean> {
  return login(page, TEST_CREDENTIALS.coachee);
}

/**
 * Login as admin helper
 */
export async function loginAsAdmin(page: Page): Promise<boolean> {
  return login(page, TEST_CREDENTIALS.admin);
}

/**
 * Logout helper
 */
export async function logout(page: Page): Promise<void> {
  try {
    // Look for logout button
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Cerrar Sesión"), a:has-text("Logout")');
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      await page.waitForURL(/sign-in|\//, { timeout: 10000 });
    }
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  // Check URL - if on dashboard/coach/admin, likely authenticated
  const url = page.url();
  if (url.includes('dashboard') || url.includes('coach') || url.includes('admin')) {
    // Verify not showing sign-in form
    const signInForm = page.locator('input[type="email"][name="email"]');
    return await signInForm.count() === 0;
  }
  return false;
}

/**
 * Wait for authentication redirect
 */
export async function waitForAuthRedirect(page: Page): Promise<void> {
  await page.waitForURL(/sign-in|dashboard|coach|admin/, { timeout: 15000 });
}

/**
 * Page route constants
 */
export const ROUTES = {
  // Public routes
  home: '/',
  features: '/features',
  pricing: '/pricing',
  about: '/about',
  blog: '/blog',
  contact: '/contact',
  tools: '/tools',
  privacy: '/privacy',
  terms: '/terms',

  // Auth routes
  signIn: '/sign-in',
  signUp: '/sign-up',
  forgotPassword: '/forgot-password',

  // Dashboard routes
  dashboard: '/dashboard',
  goals: '/goals',
  sessions: '/sessions',
  programs: '/programs',
  reflections: '/reflections',
  resources: '/resources',
  settings: '/settings',
  messages: '/messages',

  // Coach routes
  coach: '/coach',
  coachClients: '/coach/clients',
  coachSessions: '/coach/sessions',
  coachBooking: '/coach/booking',
  coachPrograms: '/coach/programs',
  coachProfile: '/coach/profile',
  coachInvite: '/coach/invite',
  coachTools: '/coach/tools',
  icfSimulator: '/coach/icf-simulator',

  // Admin routes
  admin: '/admin',
  adminUsers: '/admin/users',
  adminBlog: '/admin/blog',
  adminAnalytics: '/admin/analytics',
  adminSeo: '/admin/seo',
};

/**
 * All tool routes
 */
export const TOOL_ROUTES = TOOL_IDS.map(id => `/tools/${id}`);
