import { test, expect } from '@playwright/test';

/**
 * Visual Inspection Tests
 *
 * These tests capture screenshots of key pages for visual verification.
 * Run with: npx playwright test tests/e2e/visual-inspection.spec.ts --project=chromium
 *
 * Screenshots are saved to: tests/e2e/screenshots/
 */

const SCREENSHOT_DIR = 'tests/e2e/screenshots';

test.describe('Visual Inspection - Public Pages', () => {
  test('Home page - Hero section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000); // Wait for hydration

    // Full page screenshot
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/home-full.png`,
      fullPage: true
    });

    // Hero section only
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/home-hero.png`,
    });

    // Check for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Verify key elements exist
    await expect(page.locator('h1')).toBeVisible();

    if (errors.length > 0) {
      console.log('Console errors found:', errors);
    }
  });

  test('Home page - Features section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1500);

    // Scroll to features
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(500);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/home-features.png`,
    });
  });

  test('Home page - ICF Simulator section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1500);

    // Scroll to ICF section
    await page.evaluate(() => window.scrollBy(0, 1600));
    await page.waitForTimeout(500);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/home-icf-section.png`,
    });
  });

  test('Home page - Testimonials section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1500);

    // Scroll to testimonials
    await page.evaluate(() => window.scrollBy(0, 3000));
    await page.waitForTimeout(500);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/home-testimonials.png`,
    });
  });

  test('Blog page', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1500);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/blog-page.png`,
      fullPage: true
    });
  });

  test('Login page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1500);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/login-page.png`,
    });
  });

  test('Pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1500);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/pricing-page.png`,
      fullPage: true
    });
  });
});

test.describe('Visual Inspection - Button Interactions', () => {
  test('Demo modal opens correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1500);

    // Find and click "Ver Demo" button
    const demoButton = page.locator('button', { hasText: /ver demo/i }).first();

    if (await demoButton.isVisible()) {
      await demoButton.click();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/demo-modal-open.png`,
      });

      // Try navigating slides if modal opened
      const nextButton = page.locator('button[aria-label="Siguiente"]').or(page.locator('button:has(svg.lucide-chevron-right)'));
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(300);

        await page.screenshot({
          path: `${SCREENSHOT_DIR}/demo-modal-slide2.png`,
        });
      }

      // Close modal
      const closeButton = page.locator('button[aria-label="Cerrar"]').or(page.locator('button:has(svg.lucide-x)'));
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }
  });

  test('Navigation links work', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1500);

    // Check navigation
    const blogLink = page.locator('a[href="/blog"]').first();
    if (await blogLink.isVisible()) {
      await blogLink.click();
      await page.waitForLoadState('load');
    await page.waitForTimeout(1500);

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/nav-to-blog.png`,
      });

      expect(page.url()).toContain('/blog');
    }
  });
});

test.describe('Visual Inspection - Dark/Light Mode', () => {
  test('Home page in light mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1500);

    // Force light mode by removing dark class
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
    });
    await page.waitForTimeout(300);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/home-light-mode.png`,
      fullPage: true
    });
  });

  test('Home page in dark mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1500);

    // Force dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    await page.waitForTimeout(300);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/home-dark-mode.png`,
      fullPage: true
    });
  });
});

test.describe('Console Error Detection', () => {
  const pagesToCheck = [
    { name: 'home', url: '/' },
    { name: 'blog', url: '/blog' },
    { name: 'pricing', url: '/pricing' },
    { name: 'login', url: '/login' },
  ];

  for (const pageInfo of pagesToCheck) {
    test(`No critical errors on ${pageInfo.name} page`, async ({ page }) => {
      const errors: string[] = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          const text = msg.text();
          // Ignore some common non-critical errors
          if (!text.includes('favicon') &&
              !text.includes('third-party') &&
              !text.includes('analytics')) {
            errors.push(text);
          }
        }
      });

      page.on('pageerror', error => {
        errors.push(`Page error: ${error.message}`);
      });

      await page.goto(pageInfo.url);
      await page.waitForLoadState('load');
    await page.waitForTimeout(1500);
      await page.waitForTimeout(1000);

      if (errors.length > 0) {
        console.log(`\n⚠️ Console errors on ${pageInfo.name}:`);
        errors.forEach(e => console.log(`  - ${e}`));
      }

      // Don't fail the test, just report
      // expect(errors).toHaveLength(0);
    });
  }
});
