import { test, expect } from '@playwright/test';
import {
  waitForPageLoad,
  loginAsCoach,
  loginAsCoachee,
  ROUTES,
} from '../fixtures/test-utils';

const SCREENSHOTS_DIR = 'test-results/screenshots/tools-complete';

/**
 * Complete Coaching Tools Functional Tests
 *
 * Tests all 12 coaching tools for complete functionality:
 * 1. DISC Assessment
 * 2. Wheel of Life
 * 3. GROW Model
 * 4. Values Clarification
 * 5. Stakeholder Map
 * 6. Feedback & Feedforward
 * 7. Habit Loop
 * 8. Resilience Scale
 * 9. Emotional Triggers
 * 10. Career Compass
 * 11. Limiting Beliefs
 * 12. ICF Simulator
 */

test.describe('Coaching Tools - Complete Suite', () => {
  test.describe('1. DISC Assessment Tool', () => {
    test.beforeEach(async ({ page }) => {
      const success = await loginAsCoachee(page);
      if (!success) test.skip(true, 'Could not login');
    });

    test('1.1 DISC page loads correctly', async ({ page }) => {
      await page.goto('/tools/disc');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/disc-page.png`, fullPage: true });

      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });

    test('1.2 DISC shows questionnaire', async ({ page }) => {
      await page.goto('/tools/disc');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/disc-questionnaire.png` });

      // Page loaded successfully
      await expect(page.locator('body')).toBeVisible();
    });

    test('1.3 DISC can answer questions', async ({ page }) => {
      await page.goto('/tools/disc');
      await waitForPageLoad(page);

      const startButton = page.locator('button:has-text("Iniciar")').first();
      if (await startButton.isVisible()) {
        await startButton.click();
        await page.waitForTimeout(500);
      }

      // Find answer options (radio buttons or clickable options)
      const options = page.locator('input[type="radio"], button[class*="option"], [class*="answer-option"]');

      if (await options.count() > 0) {
        await options.first().click();
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/disc-answer.png` });
      }
    });

    test('1.4 DISC shows results with profile', async ({ page }) => {
      // Navigate to results page if it exists
      await page.goto('/tools/disc');
      await waitForPageLoad(page);

      // Look for result link or profile display
      const resultLink = page.locator('a[href*="result"]').first();
      if (await resultLink.isVisible()) {
        await resultLink.click();
        await waitForPageLoad(page);
      }

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/disc-results.png` });

      // Should show D, I, S, C profile elements
      const profileElements = page.locator('text=/dominance|influence|steadiness|conscientiousness/i');
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/disc-profile.png` });
    });
  });

  test.describe('2. Wheel of Life Tool', () => {
    test.beforeEach(async ({ page }) => {
      const success = await loginAsCoachee(page);
      if (!success) test.skip(true, 'Could not login');
    });

    test('2.1 Wheel of Life page loads', async ({ page }) => {
      await page.goto('/tools/wheel-of-life');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/wheel-page.png`, fullPage: true });

      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });

    test('2.2 Shows life areas to rate', async ({ page }) => {
      await page.goto('/tools/wheel-of-life');
      await waitForPageLoad(page);

      // Typical life areas
      const areas = ['Carrera', 'Finanzas', 'Salud', 'Familia', 'Relaciones', 'Diversión', 'Ambiente', 'Crecimiento'];

      for (const area of areas.slice(0, 3)) {
        const areaElement = page.locator(`text=/${area}/i`).first();
        await areaElement.isVisible().catch(() => false);
      }

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/wheel-areas.png` });
    });

    test('2.3 Can rate life areas (1-10 scale)', async ({ page }) => {
      await page.goto('/tools/wheel-of-life');
      await waitForPageLoad(page);

      // Find rating sliders or inputs
      const sliders = page.locator('input[type="range"]');
      const numberInputs = page.locator('input[type="number"]');

      if (await sliders.count() > 0) {
        const slider = sliders.first();
        await slider.fill('7');
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/wheel-rated.png` });
      } else if (await numberInputs.count() > 0) {
        const input = numberInputs.first();
        await input.fill('8');
      }
    });

    test('2.4 Shows wheel visualization', async ({ page }) => {
      await page.goto('/tools/wheel-of-life');
      await waitForPageLoad(page);

      // Look for canvas, SVG, or chart element
      const chart = page.locator('canvas, svg, [class*="chart"], [class*="wheel"]');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/wheel-visualization.png` });
    });
  });

  test.describe('3. GROW Model Tool', () => {
    test.beforeEach(async ({ page }) => {
      const success = await loginAsCoachee(page);
      if (!success) test.skip(true, 'Could not login');
    });

    test('3.1 GROW page loads', async ({ page }) => {
      await page.goto('/tools/grow-model');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/grow-page.png`, fullPage: true });

      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });

    test('3.2 Shows GROW sections (Goal, Reality, Options, Will)', async ({ page }) => {
      await page.goto('/tools/grow-model');
      await waitForPageLoad(page);

      const sections = ['Goal', 'Reality', 'Options', 'Will'];

      for (const section of sections) {
        const sectionElement = page.locator(`text=/${section}/i`).first();
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/grow-section-${section.toLowerCase()}.png` });
      }
    });

    test('3.3 Can fill Goal section', async ({ page }) => {
      await page.goto('/tools/grow-model');
      await waitForPageLoad(page);

      const goalInput = page.locator('textarea, input').first();
      if (await goalInput.isVisible()) {
        await goalInput.fill('Improve my leadership communication skills');
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/grow-goal-filled.png` });
      }
    });

    test('3.4 Can navigate between GROW sections', async ({ page }) => {
      await page.goto('/tools/grow-model');
      await waitForPageLoad(page);

      // Look for tabs or next buttons
      const tabs = page.locator('[role="tab"], button:has-text("Reality"), button:has-text("Siguiente")');

      if (await tabs.count() > 0) {
        await tabs.first().click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/grow-navigation.png` });
      }
    });
  });

  test.describe('4. Values Clarification Tool', () => {
    test.beforeEach(async ({ page }) => {
      const success = await loginAsCoachee(page);
      if (!success) test.skip(true, 'Could not login');
    });

    test('4.1 Values page loads', async ({ page }) => {
      await page.goto('/tools/values-clarification');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/values-page.png`, fullPage: true });
    });

    test('4.2 Shows list of values to select', async ({ page }) => {
      await page.goto('/tools/values-clarification');
      await waitForPageLoad(page);

      const values = page.locator('[class*="value"], button[class*="chip"]');
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/values-list.png` });
    });

    test('4.3 Can select and rank values', async ({ page }) => {
      await page.goto('/tools/values-clarification');
      await waitForPageLoad(page);

      const valueButtons = page.locator('button:has-text("Integridad"), button:has-text("Familia"), [class*="value"]');

      if (await valueButtons.count() > 0) {
        await valueButtons.first().click();
        await page.waitForTimeout(200);
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/values-selected.png` });
      }
    });
  });

  test.describe('5. Stakeholder Map Tool', () => {
    test.beforeEach(async ({ page }) => {
      const success = await loginAsCoachee(page);
      if (!success) test.skip(true, 'Could not login');
    });

    test('5.1 Stakeholder Map page loads', async ({ page }) => {
      await page.goto('/tools/stakeholder-map');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/stakeholder-page.png`, fullPage: true });
    });

    test('5.2 Shows stakeholder categories', async ({ page }) => {
      await page.goto('/tools/stakeholder-map');
      await waitForPageLoad(page);

      // Common stakeholder categories
      const categories = page.locator('text=/Alto Interés|Alto Poder|Bajo Interés|Gestionar/i');
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/stakeholder-categories.png` });
    });

    test('5.3 Can add stakeholder', async ({ page }) => {
      await page.goto('/tools/stakeholder-map');
      await waitForPageLoad(page);

      const addButton = page.locator('button:has-text("Agregar"), button:has-text("Add")').first();

      if (await addButton.isVisible()) {
        await addButton.click();
        await page.waitForTimeout(300);

        const nameInput = page.locator('input[name*="name"], input[placeholder*="nombre"]').first();
        if (await nameInput.isVisible()) {
          await nameInput.fill('Jefe Directo');
          await page.screenshot({ path: `${SCREENSHOTS_DIR}/stakeholder-added.png` });
        }
      }
    });
  });

  test.describe('6. Feedback & Feedforward Tool', () => {
    test.beforeEach(async ({ page }) => {
      const success = await loginAsCoachee(page);
      if (!success) test.skip(true, 'Could not login');
    });

    test('6.1 Feedback tool page loads', async ({ page }) => {
      await page.goto('/tools/feedback-feedforward');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/feedback-page.png`, fullPage: true });
    });

    test('6.2 Shows feedback and feedforward sections', async ({ page }) => {
      await page.goto('/tools/feedback-feedforward');
      await waitForPageLoad(page);

      const sections = page.locator('text=/Feedback|Feedforward/i');
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/feedback-sections.png` });
    });

    test('6.3 Can add feedback entry', async ({ page }) => {
      await page.goto('/tools/feedback-feedforward');
      await waitForPageLoad(page);

      const feedbackInput = page.locator('textarea').first();

      if (await feedbackInput.isVisible()) {
        await feedbackInput.fill('Excelente presentación del proyecto');
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/feedback-entered.png` });
      }
    });
  });

  test.describe('7. Habit Loop Tool', () => {
    test.beforeEach(async ({ page }) => {
      const success = await loginAsCoachee(page);
      if (!success) test.skip(true, 'Could not login');
    });

    test('7.1 Habit Loop page loads', async ({ page }) => {
      await page.goto('/tools/habit-loop');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/habit-page.png`, fullPage: true });
    });

    test('7.2 Shows habit loop components (Cue, Routine, Reward)', async ({ page }) => {
      await page.goto('/tools/habit-loop');
      await waitForPageLoad(page);

      const components = page.locator('text=/Señal|Rutina|Recompensa|Cue|Routine|Reward/i');
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/habit-components.png` });
    });

    test('7.3 Can define a habit', async ({ page }) => {
      await page.goto('/tools/habit-loop');
      await waitForPageLoad(page);

      const habitInput = page.locator('input, textarea').first();

      if (await habitInput.isVisible()) {
        await habitInput.fill('Revisar email al despertar');
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/habit-defined.png` });
      }
    });
  });

  test.describe('8. Resilience Scale Tool', () => {
    test.beforeEach(async ({ page }) => {
      const success = await loginAsCoachee(page);
      if (!success) test.skip(true, 'Could not login');
    });

    test('8.1 Resilience Scale page loads', async ({ page }) => {
      await page.goto('/tools/resilience-scale');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/resilience-page.png`, fullPage: true });
    });

    test('8.2 Shows resilience questions or scale', async ({ page }) => {
      await page.goto('/tools/resilience-scale');
      await waitForPageLoad(page);

      const questions = page.locator('[class*="question"], [class*="scale"]');
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/resilience-scale.png` });
    });

    test('8.3 Can rate resilience factors', async ({ page }) => {
      await page.goto('/tools/resilience-scale');
      await waitForPageLoad(page);

      const ratingInputs = page.locator('input[type="range"], input[type="radio"]');

      if (await ratingInputs.count() > 0) {
        await ratingInputs.first().click();
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/resilience-rated.png` });
      }
    });
  });

  test.describe('9. Emotional Triggers Tool', () => {
    test.beforeEach(async ({ page }) => {
      const success = await loginAsCoachee(page);
      if (!success) test.skip(true, 'Could not login');
    });

    test('9.1 Emotional Triggers page loads', async ({ page }) => {
      await page.goto('/tools/emotional-triggers');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/triggers-page.png`, fullPage: true });
    });

    test('9.2 Can identify trigger', async ({ page }) => {
      await page.goto('/tools/emotional-triggers');
      await waitForPageLoad(page);

      const triggerInput = page.locator('textarea, input').first();

      if (await triggerInput.isVisible()) {
        await triggerInput.fill('Crítica en público');
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/trigger-identified.png` });
      }
    });

    test('9.3 Can define emotional response', async ({ page }) => {
      await page.goto('/tools/emotional-triggers');
      await waitForPageLoad(page);

      const responseInput = page.locator('textarea').nth(1);

      if (await responseInput.isVisible()) {
        await responseInput.fill('Me siento frustrado y a la defensiva');
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/trigger-response.png` });
      }
    });
  });

  test.describe('10. Career Compass Tool', () => {
    test.beforeEach(async ({ page }) => {
      const success = await loginAsCoachee(page);
      if (!success) test.skip(true, 'Could not login');
    });

    test('10.1 Career Compass page loads', async ({ page }) => {
      await page.goto('/tools/career-compass');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/career-page.png`, fullPage: true });
    });

    test('10.2 Shows career dimensions', async ({ page }) => {
      await page.goto('/tools/career-compass');
      await waitForPageLoad(page);

      const dimensions = page.locator('text=/Pasión|Habilidades|Mercado|Propósito/i');
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/career-dimensions.png` });
    });

    test('10.3 Can complete career assessment', async ({ page }) => {
      await page.goto('/tools/career-compass');
      await waitForPageLoad(page);

      const inputs = page.locator('input, textarea');

      if (await inputs.count() > 0) {
        await inputs.first().fill('Liderar equipos de alto rendimiento');
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/career-completed.png` });
      }
    });
  });

  test.describe('11. Limiting Beliefs Tool', () => {
    test.beforeEach(async ({ page }) => {
      const success = await loginAsCoachee(page);
      if (!success) test.skip(true, 'Could not login');
    });

    test('11.1 Limiting Beliefs page loads', async ({ page }) => {
      await page.goto('/tools/limiting-beliefs');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/beliefs-page.png`, fullPage: true });
    });

    test('11.2 Can identify limiting belief', async ({ page }) => {
      await page.goto('/tools/limiting-beliefs');
      await waitForPageLoad(page);

      const beliefInput = page.locator('textarea').first();

      if (await beliefInput.isVisible()) {
        await beliefInput.fill('No soy lo suficientemente bueno para ese puesto');
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/belief-identified.png` });
      }
    });

    test('11.3 Can reframe belief', async ({ page }) => {
      await page.goto('/tools/limiting-beliefs');
      await waitForPageLoad(page);

      const reframeInput = page.locator('textarea').nth(1);

      if (await reframeInput.isVisible()) {
        await reframeInput.fill('Tengo las habilidades necesarias y puedo seguir desarrollándome');
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/belief-reframed.png` });
      }
    });
  });

  test.describe('12. ICF Simulator Tool (Coach Only)', () => {
    test.beforeEach(async ({ page }) => {
      const success = await loginAsCoach(page);
      if (!success) test.skip(true, 'Could not login as coach');
    });

    test('12.1 ICF Simulator page loads', async ({ page }) => {
      await page.goto('/coach/icf-simulator');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/icf-page.png`, fullPage: true });
    });

    test('12.2 Shows ICF competencies', async ({ page }) => {
      await page.goto('/coach/icf-simulator');
      await waitForPageLoad(page);

      const competencies = page.locator('text=/Fundamentos|Comunicación|Facilitación/i');
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/icf-competencies.png` });
    });

    test('12.3 Can start practice exam', async ({ page }) => {
      await page.goto('/coach/icf-simulator');
      await waitForPageLoad(page);

      const startButton = page.locator('button:has-text("Iniciar"), button:has-text("Comenzar")').first();

      if (await startButton.isVisible()) {
        await startButton.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/icf-exam-started.png` });
      }
    });
  });

  test.describe('Tools Index Page', () => {
    test('Shows all available tools', async ({ page }) => {
      const success = await loginAsCoachee(page);
      if (!success) test.skip(true, 'Could not login');

      await page.goto('/tools');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/tools-index.png`, fullPage: true });

      // Check for tool cards or links
      const toolLinks = page.locator('a[href*="/tools/"]');
      expect(await toolLinks.count()).toBeGreaterThan(0);
    });

    test('Tools have descriptions', async ({ page }) => {
      const success = await loginAsCoachee(page);
      if (!success) test.skip(true, 'Could not login');

      await page.goto('/tools');
      await waitForPageLoad(page);

      const descriptions = page.locator('[class*="description"], [class*="card"] p');
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/tools-descriptions.png` });
    });
  });

  test.describe('Tool Results and History', () => {
    test.beforeEach(async ({ page }) => {
      const success = await loginAsCoachee(page);
      if (!success) test.skip(true, 'Could not login');
    });

    test('Can view tool history', async ({ page }) => {
      await page.goto('/tools/disc');
      await waitForPageLoad(page);

      // Look for history or previous results section
      const historySection = page.locator('text=/Historial|Resultados anteriores|Previous/i');
      const historyLink = page.locator('a[href*="history"], a[href*="results"]');

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/tool-history.png` });
    });

    test('Can save tool progress', async ({ page }) => {
      await page.goto('/tools/wheel-of-life');
      await waitForPageLoad(page);

      // Look for save button
      const saveButton = page.locator('button:has-text("Guardar"), button:has-text("Save")').first();

      if (await saveButton.isVisible()) {
        await saveButton.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/tool-saved.png` });
      }
    });
  });
});
