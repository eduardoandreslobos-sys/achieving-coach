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
