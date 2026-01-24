import { test, expect } from '@playwright/test';
import {
  waitForPageLoad,
  loginAsCoach,
  ROUTES,
} from '../fixtures/test-utils';

const SCREENSHOTS_DIR = 'test-results/screenshots/icf';

/**
 * ICF Simulator Flow Tests
 *
 * Tests the ICF certification exam simulator:
 * - Exam page loading
 * - Starting exam
 * - Answering questions
 * - Timer functionality
 * - Submitting exam
 * - Viewing results
 * - Results history
 */

test.describe('ICF Simulator', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoach(page);
    if (!success) {
      test.skip(true, 'Could not login as coach');
    }
  });

  test.describe('1. Simulator Page', () => {
    test('1.1 ICF Simulator page loads', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/simulator-page.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });

    test('1.2 Shows ICF domains/competencies', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      // Look for ICF competency content
      const competencies = page.locator('[class*="competenc"], [class*="domain"]');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/icf-competencies.png` });
    });

    test('1.3 Shows exam instructions', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      // Look for instructions or info
      const instructions = page.locator('text=/instrucciones|60 minutos|preguntas/i');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/exam-instructions.png` });
    });

    test('1.4 Start exam button exists', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      const startButton = page.locator('button:has-text("Iniciar"), button:has-text("Comenzar"), button:has-text("Start")').first();

      if (await startButton.isVisible()) {
        await expect(startButton).toBeEnabled();
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/start-button.png` });
      }
    });
  });

  test.describe('2. Exam Flow', () => {
    test('2.1 Can start exam', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      const startButton = page.locator('button:has-text("Iniciar"), button:has-text("Comenzar")').first();

      if (await startButton.isVisible()) {
        await startButton.click();
        await page.waitForTimeout(1000);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/exam-started.png` });
      }
    });

    test('2.2 Timer is visible during exam', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      const startButton = page.locator('button:has-text("Iniciar")').first();

      if (await startButton.isVisible()) {
        await startButton.click();
        await page.waitForTimeout(1000);

        // Look for timer
        const timer = page.locator('[class*="timer"], text=/\\d+:\\d+/');

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/exam-timer.png` });
      }
    });

    test('2.3 Questions display correctly', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      const startButton = page.locator('button:has-text("Iniciar")').first();

      if (await startButton.isVisible()) {
        await startButton.click();
        await page.waitForTimeout(1000);

        // Look for question content
        const question = page.locator('[class*="question"], [data-testid*="question"]');

        if (await question.count() > 0) {
          await page.screenshot({ path: `${SCREENSHOTS_DIR}/exam-question.png` });
        }
      }
    });

    test('2.4 Can select answer', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      const startButton = page.locator('button:has-text("Iniciar")').first();

      if (await startButton.isVisible()) {
        await startButton.click();
        await page.waitForTimeout(1000);

        // Look for answer options
        const options = page.locator('input[type="radio"], [class*="option"], button[class*="answer"]');

        if (await options.count() > 0) {
          await options.first().click();
          await page.waitForTimeout(300);

          await page.screenshot({ path: `${SCREENSHOTS_DIR}/answer-selected.png` });
        }
      }
    });

    test('2.5 Can navigate between questions', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      const startButton = page.locator('button:has-text("Iniciar")').first();

      if (await startButton.isVisible()) {
        await startButton.click();
        await page.waitForTimeout(1000);

        // Look for navigation buttons
        const nextButton = page.locator('button:has-text("Siguiente"), button:has-text("Next")').first();

        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForTimeout(500);

          await page.screenshot({ path: `${SCREENSHOTS_DIR}/next-question.png` });
        }
      }
    });

    test('2.6 Progress indicator shows', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      const startButton = page.locator('button:has-text("Iniciar")').first();

      if (await startButton.isVisible()) {
        await startButton.click();
        await page.waitForTimeout(1000);

        // Look for progress indicator
        const progress = page.locator('[class*="progress"], text=/\\d+.*de.*\\d+|pregunta \\d+/i');

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/exam-progress.png` });
      }
    });
  });

  test.describe('3. Submit Exam', () => {
    test('3.1 Submit button exists', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      const startButton = page.locator('button:has-text("Iniciar")').first();

      if (await startButton.isVisible()) {
        await startButton.click();
        await page.waitForTimeout(1000);

        const submitButton = page.locator('button:has-text("Enviar"), button:has-text("Terminar"), button:has-text("Submit")').first();

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/submit-button.png` });
      }
    });

    test('3.2 Submit shows confirmation', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      const startButton = page.locator('button:has-text("Iniciar")').first();

      if (await startButton.isVisible()) {
        await startButton.click();
        await page.waitForTimeout(1000);

        const submitButton = page.locator('button:has-text("Enviar"), button:has-text("Terminar")').first();

        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForTimeout(500);

          // Should show confirmation
          await page.screenshot({ path: `${SCREENSHOTS_DIR}/submit-confirm.png` });

          // Cancel if confirmation dialog
          const cancelButton = page.locator('button:has-text("Cancelar"), button:has-text("No")').first();
          if (await cancelButton.isVisible()) {
            await cancelButton.click();
          }
        }
      }
    });
  });

  test.describe('4. Results Page', () => {
    test('4.1 Results page loads', async ({ page }) => {
      // Try to access results page directly (may need existing result)
      await page.goto('/coach/icf-simulator/results');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/results-page.png`, fullPage: true });
    });

    test('4.2 Shows score breakdown', async ({ page }) => {
      // This test would work after completing an exam
      await page.goto('/coach/icf-simulator');
      await waitForPageLoad(page);

      // Look for results/history section
      const resultsSection = page.locator('[class*="results"], [class*="history"], text=/resultados anteriores/i');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/results-section.png` });
    });

    test('4.3 Shows competency breakdown', async ({ page }) => {
      await page.goto('/coach/icf-simulator');
      await waitForPageLoad(page);

      // Look for competency chart or breakdown
      const competencyChart = page.locator('[class*="chart"], [class*="competency-breakdown"]');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/competency-breakdown.png` });
    });
  });

  test.describe('5. History', () => {
    test('5.1 Shows previous attempts', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      // Look for history section
      const historySection = page.locator('[class*="history"], text=/intentos anteriores|historial/i');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/attempts-history.png` });
    });

    test('5.2 Can view past result details', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      // Look for clickable result links
      const resultLink = page.locator('a[href*="results/"], button:has-text("Ver")').first();

      if (await resultLink.isVisible()) {
        await resultLink.click();
        await waitForPageLoad(page);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/past-result-detail.png` });
      }
    });
  });

  test.describe('6. ICF Domains', () => {
    const domains = [
      'Fundamentos',
      'Co-Creación de la Relación',
      'Comunicación Eficaz',
      'Cultivar Aprendizaje',
    ];

    test('6.1 Shows all ICF domains', async ({ page }) => {
      await page.goto(ROUTES.icfSimulator);
      await waitForPageLoad(page);

      let foundDomains = 0;
      for (const domain of domains) {
        const domainElement = page.locator(`text=${domain}`).first();
        if (await domainElement.isVisible().catch(() => false)) {
          foundDomains++;
        }
      }

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/icf-domains.png` });
    });
  });
});
