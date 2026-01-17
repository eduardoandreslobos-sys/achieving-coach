import { test, expect, Page } from '@playwright/test';

// All public pages to test
const publicPages = [
  { path: '/', name: 'Homepage' },
  { path: '/features', name: 'Features' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact' },
  { path: '/blog', name: 'Blog' },
  { path: '/privacy', name: 'Privacy' },
  { path: '/terms', name: 'Terms' },
  { path: '/sign-in', name: 'Sign In' },
  { path: '/sign-up', name: 'Sign Up' },
];

// Tool pages to test (require auth, test landing pages only)
const toolPages = [
  { path: '/coach/tools', name: 'Coach Tools Page' },
];

interface ConsoleError {
  type: string;
  text: string;
  url: string;
}

async function collectConsoleErrors(page: Page, url: string): Promise<ConsoleError[]> {
  const errors: ConsoleError[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push({
        type: 'console.error',
        text: msg.text(),
        url: url,
      });
    }
  });

  page.on('pageerror', (error) => {
    errors.push({
      type: 'pageerror',
      text: error.message,
      url: url,
    });
  });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for async errors
  } catch (e) {
    errors.push({
      type: 'navigation',
      text: String(e),
      url: url,
    });
  }

  return errors;
}

// Filter out known/expected errors
function filterKnownErrors(errors: ConsoleError[]): ConsoleError[] {
  const knownPatterns = [
    /Failed to load resource.*favicon/i,
    /404.*favicon/i,
    /Failed to load resource.*404/i, // Generic 404 resource errors
    /ERR_BLOCKED_BY_CLIENT/i, // Ad blockers
    /net::ERR_FAILED/i, // Network issues in test env
    /hydration/i, // React hydration warnings (common in dev)
    /Warning: validateDOMNesting/i, // React DOM nesting warnings
    /Download the React DevTools/i,
    /gtag|analytics|googletagmanager/i, // Analytics scripts
    /contentsquare/i, // Analytics
    /hotjar/i, // Analytics
    /Failed to fetch/i, // Common in dev when services aren't running
    /Firebase.*not.*configured/i, // Expected when Firebase env vars not set
    /Running without Firebase/i, // Expected in test env
  ];

  return errors.filter((error) => {
    return !knownPatterns.some((pattern) => pattern.test(error.text));
  });
}

test.describe('Console Error Detection - Public Pages', () => {
  for (const pageInfo of publicPages) {
    test(`${pageInfo.name} (${pageInfo.path}) - should have no console errors`, async ({ page }) => {
      const errors = await collectConsoleErrors(page, pageInfo.path);
      const filteredErrors = filterKnownErrors(errors);

      if (filteredErrors.length > 0) {
        console.log(`\n❌ Errors found on ${pageInfo.name}:`);
        filteredErrors.forEach((e) => console.log(`  - [${e.type}] ${e.text}`));
      }

      expect(filteredErrors).toHaveLength(0);
    });
  }
});

test.describe('Console Error Detection - Tool Pages', () => {
  for (const pageInfo of toolPages) {
    test(`${pageInfo.name} (${pageInfo.path}) - should have no console errors`, async ({ page }) => {
      const errors = await collectConsoleErrors(page, pageInfo.path);
      const filteredErrors = filterKnownErrors(errors);

      if (filteredErrors.length > 0) {
        console.log(`\n❌ Errors found on ${pageInfo.name}:`);
        filteredErrors.forEach((e) => console.log(`  - [${e.type}] ${e.text}`));
      }

      expect(filteredErrors).toHaveLength(0);
    });
  }
});

test.describe('Console Error Detection - Page Load Performance', () => {
  test('Homepage should load without critical errors', async ({ page }) => {
    const errors: ConsoleError[] = [];
    const warnings: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push({ type: 'error', text: msg.text(), url: '/' });
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      errors.push({ type: 'pageerror', text: error.message, url: '/' });
    });

    const response = await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 });

    // Check response status
    expect(response?.status()).toBeLessThan(400);

    // Wait for page to stabilize
    await page.waitForTimeout(3000);

    const filteredErrors = filterKnownErrors(errors);

    // Log all findings
    if (filteredErrors.length > 0) {
      console.log('\n🔴 Critical Errors:');
      filteredErrors.forEach((e) => console.log(`  ${e.text}`));
    }

    if (warnings.length > 0) {
      console.log('\n🟡 Warnings (for reference):');
      warnings.slice(0, 5).forEach((w) => console.log(`  ${w}`));
    }

    expect(filteredErrors).toHaveLength(0);
  });
});

test.describe('JavaScript Runtime Errors', () => {
  test('Homepage should have no uncaught exceptions', async ({ page }) => {
    const uncaughtErrors: string[] = [];

    page.on('pageerror', (error) => {
      uncaughtErrors.push(error.message);
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Interact with page to trigger potential errors
    await page.waitForTimeout(1000);

    // Try scrolling
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);

    // Try clicking navigation
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();
    if (count > 0) {
      // Hover over first nav link
      await navLinks.first().hover().catch(() => {});
    }

    await page.waitForTimeout(1000);

    if (uncaughtErrors.length > 0) {
      console.log('\n🔴 Uncaught Exceptions:');
      uncaughtErrors.forEach((e) => console.log(`  ${e}`));
    }

    // Filter known issues
    const criticalErrors = uncaughtErrors.filter((e) => {
      return !e.includes('hydration') &&
             !e.includes('analytics') &&
             !e.includes('gtag');
    });

    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Network Request Errors', () => {
  test('Homepage should not have failed API requests', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('requestfailed', (request) => {
      const url = request.url();
      // Ignore analytics and external resources
      if (!url.includes('google') &&
          !url.includes('analytics') &&
          !url.includes('contentsquare') &&
          !url.includes('hotjar') &&
          !url.includes('fonts.')) {
        failedRequests.push(`${request.failure()?.errorText}: ${url}`);
      }
    });

    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 });

    if (failedRequests.length > 0) {
      console.log('\n🔴 Failed Network Requests:');
      failedRequests.forEach((r) => console.log(`  ${r}`));
    }

    expect(failedRequests).toHaveLength(0);
  });
});
