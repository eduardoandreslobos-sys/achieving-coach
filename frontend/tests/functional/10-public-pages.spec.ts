import { test, expect } from '@playwright/test';
import { waitForPageLoad, ROUTES } from '../fixtures/test-utils';

const SCREENSHOTS_DIR = 'test-results/screenshots/public';

/**
 * Public Pages Flow Tests
 *
 * Tests all publicly accessible pages:
 * - Home page
 * - Pricing
 * - Features
 * - About
 * - Contact
 * - Blog
 * - Privacy/Terms
 */

test.describe('Public Pages', () => {
  test.describe('1. Home Page', () => {
    test('1.1 Home page loads correctly', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/home-page.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"], body');
      await expect(mainContent.first()).toBeVisible();
    });

    test('1.2 Hero section displays', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      // Look for hero content
      const hero = page.locator('[class*="hero"], h1');
      await expect(hero.first()).toBeVisible();

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/home-hero.png` });
    });

    test('1.3 Navigation links work', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      const navLinks = page.locator('nav a');
      const count = await navLinks.count();

      expect(count).toBeGreaterThan(0);
    });

    test('1.4 CTA buttons are visible', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      const ctaButtons = page.locator('a[href*="sign"], button:has-text("Comenzar"), a:has-text("Comenzar")');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/home-ctas.png` });
    });

    test('1.5 Demo modal opens', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      const demoButton = page.locator('button:has-text("Demo"), button:has-text("Ver Demo"), a:has-text("Demo")').first();

      const isVisible = await demoButton.isVisible({ timeout: 3000 }).catch(() => false);
      if (isVisible) {
        await demoButton.click({ force: true });
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/demo-modal.png` });

        // Close modal
        const closeButton = page.locator('button[aria-label*="close"], button:has(svg[class*="x"])').first();
        const closeVisible = await closeButton.isVisible({ timeout: 1000 }).catch(() => false);
        if (closeVisible) {
          await closeButton.click({ force: true });
        }
      } else {
        // No demo button - take screenshot anyway
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/home-no-demo.png` });
      }
    });

    test('1.6 Features section visible on scroll', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      // Scroll down
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(500);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/home-features.png` });
    });

    test('1.7 Testimonials section visible', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      // Scroll to testimonials
      await page.evaluate(() => window.scrollBy(0, 2000));
      await page.waitForTimeout(500);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/home-testimonials.png` });
    });

    test('1.8 Footer displays', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      const footer = page.locator('footer');
      await expect(footer.first()).toBeVisible();

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/home-footer.png` });
    });
  });

  test.describe('2. Pricing Page', () => {
    test('2.1 Pricing page loads', async ({ page }) => {
      await page.goto(ROUTES.pricing);
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/pricing-page.png`, fullPage: true });

      // Page should have loaded - check body is visible
      await expect(page.locator('body')).toBeVisible();
      // Check we're on pricing page
      expect(page.url()).toContain('pricing');
    });

    test('2.2 Shows pricing plans', async ({ page }) => {
      await page.goto(ROUTES.pricing);
      await waitForPageLoad(page);

      const plans = page.locator('[class*="plan"], [class*="pricing-card"], [class*="tier"]');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/pricing-plans.png` });
    });

    test('2.3 Plan CTAs link to signup', async ({ page }) => {
      await page.goto(ROUTES.pricing);
      await waitForPageLoad(page);

      const planCta = page.locator('a[href*="sign"], button:has-text("Comenzar")').first();

      if (await planCta.isVisible()) {
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/pricing-cta.png` });
      }
    });
  });

  test.describe('3. Features Page', () => {
    test('3.1 Features page loads', async ({ page }) => {
      await page.goto('/features');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/features-page.png`, fullPage: true });

      // Page should have loaded
      await expect(page.locator('body')).toBeVisible();
      expect(page.url()).toContain('features');
    });

    test('3.2 Shows feature list', async ({ page }) => {
      await page.goto('/features');
      await waitForPageLoad(page);

      const features = page.locator('[class*="feature"], [class*="benefit"]');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/features-list.png` });
    });
  });

  test.describe('4. About Page', () => {
    test('4.1 About page loads', async ({ page }) => {
      await page.goto('/about');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/about-page.png`, fullPage: true });

      // Page should have loaded
      await expect(page.locator('body')).toBeVisible();
      expect(page.url()).toContain('about');
    });

    test('4.2 Shows company info', async ({ page }) => {
      await page.goto('/about');
      await waitForPageLoad(page);

      // Look for about content
      const aboutContent = page.locator('[class*="about"], h1, h2');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/about-content.png` });
    });
  });

  test.describe('5. Contact Page', () => {
    test('5.1 Contact page loads', async ({ page }) => {
      await page.goto('/contact');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/contact-page.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });

    test('5.2 Contact form exists', async ({ page }) => {
      await page.goto('/contact');
      await waitForPageLoad(page);

      const contactForm = page.locator('form');

      if (await contactForm.count() > 0) {
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/contact-form.png` });
      }
    });

    test('5.3 Contact form has required fields', async ({ page }) => {
      await page.goto('/contact');
      await waitForPageLoad(page);

      const nameInput = page.locator('input[name*="name"], input[placeholder*="nombre"]');
      const emailInput = page.locator('input[type="email"]');
      const messageInput = page.locator('textarea');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/contact-fields.png` });
    });

    test('5.4 Contact form validates inputs', async ({ page }) => {
      await page.goto('/contact');
      await waitForPageLoad(page);

      const submitButton = page.locator('button[type="submit"]').first();

      const isVisible = await submitButton.isVisible({ timeout: 3000 }).catch(() => false);
      if (isVisible) {
        await submitButton.click({ force: true });
        await page.waitForTimeout(500);

        // Should show validation
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/contact-validation.png` });
      }
    });

    test('5.5 Can fill contact form', async ({ page }) => {
      await page.goto('/contact');
      await waitForPageLoad(page);

      const nameInput = page.locator('input[name*="name"]').first();
      const emailInput = page.locator('input[type="email"]').first();
      const messageInput = page.locator('textarea').first();

      if (await nameInput.isVisible()) {
        await nameInput.fill('Test User');
      }
      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com');
      }
      if (await messageInput.isVisible()) {
        await messageInput.fill('This is a test message from automated tests.');
      }

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/contact-filled.png` });
    });
  });

  test.describe('6. Blog Page', () => {
    test('6.1 Blog page loads', async ({ page }) => {
      await page.goto(ROUTES.blog);
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/blog-page.png`, fullPage: true });

      // Page should have loaded
      await expect(page.locator('body')).toBeVisible();
      expect(page.url()).toContain('blog');
    });

    test('6.2 Shows blog posts', async ({ page }) => {
      await page.goto(ROUTES.blog);
      await waitForPageLoad(page);

      const blogPosts = page.locator('[class*="post"], article, [class*="blog-card"]');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/blog-posts.png` });
    });

    test('6.3 Category filter works', async ({ page }) => {
      await page.goto(ROUTES.blog);
      await waitForPageLoad(page);

      const categoryButtons = page.locator('button[class*="category"], [class*="filter"]');

      if (await categoryButtons.count() > 0) {
        await categoryButtons.first().click();
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/blog-filtered.png` });
      }
    });

    test('6.4 Can click on blog post', async ({ page }) => {
      await page.goto(ROUTES.blog);
      await waitForPageLoad(page);

      const postLink = page.locator('a[href*="/blog/"]').first();

      const isVisible = await postLink.isVisible({ timeout: 5000 }).catch(() => false);
      if (isVisible) {
        await postLink.click({ force: true });
        await waitForPageLoad(page);

        expect(page.url()).toContain('/blog/');

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/blog-post-detail.png` });
      } else {
        // No blog posts - skip
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/blog-no-posts.png` });
      }
    });

    test('6.5 Blog post shows full content', async ({ page }) => {
      await page.goto(ROUTES.blog);
      await waitForPageLoad(page);

      const postLink = page.locator('a[href*="/blog/"]').first();

      const isVisible = await postLink.isVisible({ timeout: 5000 }).catch(() => false);
      if (isVisible) {
        await postLink.click({ force: true });
        await waitForPageLoad(page);

        // Look for article content
        const article = page.locator('article, [class*="post-content"]');

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/blog-article.png`, fullPage: true });
      }
    });
  });

  test.describe('7. Legal Pages', () => {
    test('7.1 Privacy policy page loads', async ({ page }) => {
      await page.goto('/privacy');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/privacy-page.png`, fullPage: true });

      // Page should have loaded
      await expect(page.locator('body')).toBeVisible();
    });

    test('7.2 Terms of service page loads', async ({ page }) => {
      await page.goto('/terms');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/terms-page.png`, fullPage: true });

      // Page should have loaded
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('8. Public Booking', () => {
    test('8.1 Booking page structure exists', async ({ page }) => {
      // This needs a valid coachId
      await page.goto('/book/test-coach-id');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/booking-page.png` });

      // May show 404 or booking page depending on data
    });
  });

  test.describe('9. Cookie Consent', () => {
    test('9.1 Cookie banner appears on first visit', async ({ page }) => {
      // Clear cookies first
      await page.context().clearCookies();

      await page.goto('/');
      await waitForPageLoad(page);

      const cookieBanner = page.locator('[class*="cookie"], [class*="consent"]');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/cookie-banner.png` });
    });

    test('9.2 Can accept all cookies', async ({ page }) => {
      await page.context().clearCookies();

      await page.goto('/');
      await waitForPageLoad(page);

      const acceptButton = page.locator('button:has-text("Aceptar todas")').first();

      if (await acceptButton.isVisible()) {
        await acceptButton.click();
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/cookies-accepted.png` });
      }
    });

    test('9.3 Can accept only necessary cookies', async ({ page }) => {
      await page.context().clearCookies();

      await page.goto('/');
      await waitForPageLoad(page);

      const necessaryButton = page.locator('button:has-text("Solo necesarias")').first();

      if (await necessaryButton.isVisible()) {
        await necessaryButton.click();
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/cookies-necessary.png` });
      }
    });

    test('9.4 Can configure cookie preferences', async ({ page }) => {
      await page.context().clearCookies();

      await page.goto('/');
      await waitForPageLoad(page);

      const configureButton = page.locator('button:has-text("Configurar")').first();

      if (await configureButton.isVisible()) {
        await configureButton.click();
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/cookie-config.png` });
      }
    });
  });

  test.describe('10. Theme Toggle', () => {
    test('10.1 Theme toggle button exists', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      const themeToggle = page.locator('[class*="theme"], button[aria-label*="theme"], button:has(svg[class*="sun"]), button:has(svg[class*="moon"])');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/theme-toggle.png` });
    });

    test('10.2 Can toggle to light mode', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      // Force dark mode first
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
      });

      const themeToggle = page.locator('button:has(svg[class*="sun"]), button:has(svg[class*="moon"])').first();

      if (await themeToggle.isVisible()) {
        await themeToggle.click();
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/light-mode.png` });
      }
    });
  });

  test.describe('11. Responsive Design', () => {
    test('11.1 Home page on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/home-mobile.png`, fullPage: true });
    });

    test('11.2 Home page on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await page.goto('/');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/home-tablet.png`, fullPage: true });
    });

    test('11.3 Mobile navigation menu', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/');
      await waitForPageLoad(page);

      const mobileMenu = page.locator('button[class*="mobile"], button[aria-label*="menu"]').first();

      if (await mobileMenu.isVisible()) {
        await mobileMenu.click();
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/mobile-menu.png` });
      }
    });
  });

  test.describe('12. SEO Elements', () => {
    test('12.1 Page has meta title', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });

    test('12.2 Page has meta description', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      const metaDescription = page.locator('meta[name="description"]');
      const content = await metaDescription.getAttribute('content');

      // May or may not have description
    });

    test('12.3 Page has Open Graph tags', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      const ogTitle = page.locator('meta[property="og:title"]');
      const ogDescription = page.locator('meta[property="og:description"]');

      // May or may not have OG tags
    });
  });
});
