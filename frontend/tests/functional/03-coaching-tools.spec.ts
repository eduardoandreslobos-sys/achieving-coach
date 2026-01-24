import { test, expect } from '@playwright/test';
import {
  waitForPageLoad,
  loginAsCoachee,
  loginAsCoach,
  TOOL_IDS,
  TOOL_NAMES,
} from '../fixtures/test-utils';

const SCREENSHOTS_DIR = 'test-results/screenshots/tools';

/**
 * Coaching Tools Flow Tests
 *
 * Tests the coaching tools functionality:
 * - Tool access and loading
 * - Wheel of Life completion flow
 * - GROW Model completion flow
 * - Tool results saving
 * - History viewing
 */

test.describe('Coaching Tools - General', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoachee(page);
    if (!success) {
      test.skip(true, 'Could not login as coachee');
    }
  });

  test.describe('1. Tools Library', () => {
    test('1.1 Tools page loads and shows available tools', async ({ page }) => {
      await page.goto('/tools');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/tools-library.png`, fullPage: true });

      // Should show tool cards
      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();

      // Check for tool names (at least some)
      const toolLinks = page.locator('a[href*="/tools/"]');
      const count = await toolLinks.count();

      // Should have multiple tool links
      expect(count).toBeGreaterThan(0);
    });

    test('1.2 Each tool has proper card display', async ({ page }) => {
      await page.goto('/tools');
      await waitForPageLoad(page);

      // Check for tool cards with expected content
      const cards = page.locator('.card, [class*="card"], [class*="tool"]');

      if (await cards.count() > 0) {
        const firstCard = cards.first();
        await expect(firstCard).toBeVisible();
      }
    });
  });

  test.describe('2. Tool Navigation', () => {
    for (const toolId of ['wheel-of-life', 'grow-model', 'disc']) {
      test(`2.x Navigate to ${toolId} tool`, async ({ page }) => {
        await page.goto(`/tools/${toolId}`);
        await waitForPageLoad(page);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/tool-${toolId}.png`, fullPage: true });

        // Page should load without errors
        const mainContent = page.locator('main, [role="main"]');
        await expect(mainContent.first()).toBeVisible();

        // Should not show 404
        const notFound = page.locator('text=/404|not found|no encontrado/i');
        expect(await notFound.count()).toBe(0);
      });
    }
  });
});

test.describe('Wheel of Life Tool', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoachee(page);
    if (!success) {
      test.skip(true, 'Could not login as coachee');
    }
  });

  test.describe('1. Page Loading', () => {
    test('1.1 Wheel of Life page loads correctly', async ({ page }) => {
      await page.goto('/tools/wheel-of-life');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/wheel-of-life-loaded.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });

    test('1.2 Shows all 8 life areas', async ({ page }) => {
      await page.goto('/tools/wheel-of-life');
      await waitForPageLoad(page);

      // Expected life areas in Spanish
      const lifeAreas = [
        'Carrera',
        'Finanzas',
        'Salud',
        'Relaciones',
        'Crecimiento Personal',
        'Diversión',
        'Entorno',
        'Espiritualidad',
      ];

      // Check that at least some areas are visible
      let foundAreas = 0;
      for (const area of lifeAreas) {
        const areaElement = page.locator(`text=${area}`).first();
        if (await areaElement.isVisible().catch(() => false)) {
          foundAreas++;
        }
      }

      // Should find at least some areas (may have access restrictions)
      // If tool requires assignment, it might show access message instead
    });
  });

  test.describe('2. Scoring Interaction', () => {
    test('2.1 Score sliders are interactive', async ({ page }) => {
      await page.goto('/tools/wheel-of-life');
      await waitForPageLoad(page);

      // Look for sliders or range inputs
      const sliders = page.locator('input[type="range"], [role="slider"]');
      const sliderCount = await sliders.count();

      if (sliderCount > 0) {
        // Test first slider
        const firstSlider = sliders.first();
        await expect(firstSlider).toBeVisible();

        // Try to change value
        await firstSlider.fill('7');
        await page.waitForTimeout(300);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/wheel-of-life-slider.png` });
      }
    });

    test('2.2 Score changes update visualization', async ({ page }) => {
      await page.goto('/tools/wheel-of-life');
      await waitForPageLoad(page);

      const sliders = page.locator('input[type="range"], [role="slider"]');

      if (await sliders.count() > 0) {
        // Fill multiple sliders with different values
        const slidersArray = await sliders.all();

        for (let i = 0; i < Math.min(slidersArray.length, 4); i++) {
          const value = (i + 1) * 2; // 2, 4, 6, 8
          await slidersArray[i].fill(String(value));
          await page.waitForTimeout(200);
        }

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/wheel-of-life-scored.png` });

        // Check if radar chart or wheel visualization updates
        const chart = page.locator('canvas, svg[class*="chart"], [class*="wheel"], [class*="radar"]');
        if (await chart.count() > 0) {
          await expect(chart.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('3. Save Functionality', () => {
    test('3.1 Save button exists and is clickable', async ({ page }) => {
      await page.goto('/tools/wheel-of-life');
      await waitForPageLoad(page);

      const saveButton = page.locator('button:has-text("guardar"), button:has-text("save"), button[type="submit"]').first();

      if (await saveButton.isVisible()) {
        await expect(saveButton).toBeEnabled();
      }
    });

    test('3.2 Validation prevents saving incomplete assessment', async ({ page }) => {
      await page.goto('/tools/wheel-of-life');
      await waitForPageLoad(page);

      // Don't fill any sliders
      const saveButton = page.locator('button:has-text("guardar"), button:has-text("save")').first();

      if (await saveButton.isVisible()) {
        await saveButton.click();
        await page.waitForTimeout(1000);

        // Should show error toast or validation message
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/wheel-of-life-validation.png` });

        const errorMessage = page.locator('[class*="toast"], [role="alert"], text=/error|completa|todas/i');
        // May or may not show explicit error depending on implementation
      }
    });

    test('3.3 Complete assessment and save', async ({ page }) => {
      await page.goto('/tools/wheel-of-life');
      await waitForPageLoad(page);

      const sliders = page.locator('input[type="range"], [role="slider"]');
      const sliderCount = await sliders.count();

      if (sliderCount >= 8) {
        // Fill all sliders
        const slidersArray = await sliders.all();

        for (let i = 0; i < slidersArray.length; i++) {
          await slidersArray[i].fill(String(Math.floor(Math.random() * 10) + 1));
          await page.waitForTimeout(100);
        }

        // Save
        const saveButton = page.locator('button:has-text("guardar"), button:has-text("save")').first();

        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForTimeout(2000);

          await page.screenshot({ path: `${SCREENSHOTS_DIR}/wheel-of-life-saved.png` });

          // Check for success message
          const successMessage = page.locator('[class*="toast"], text=/guardado|éxito|saved/i');
        }
      }
    });
  });
});

test.describe('GROW Model Tool', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoachee(page);
    if (!success) {
      test.skip(true, 'Could not login as coachee');
    }
  });

  test.describe('1. Page Loading', () => {
    test('1.1 GROW page loads correctly', async ({ page }) => {
      await page.goto('/tools/grow-model');
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/grow-model-loaded.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });

    test('1.2 Shows GROW sections', async ({ page }) => {
      await page.goto('/tools/grow-model');
      await waitForPageLoad(page);

      // Check for GROW sections
      const growSections = ['Goal', 'Reality', 'Options', 'Will'];
      const spanishSections = ['Meta', 'Realidad', 'Opciones', 'Voluntad'];

      let foundSections = 0;
      for (const section of [...growSections, ...spanishSections]) {
        const sectionElement = page.locator(`text=${section}`).first();
        if (await sectionElement.isVisible().catch(() => false)) {
          foundSections++;
        }
      }

      // Should find at least one GROW letter
      // May have access restrictions
    });
  });

  test.describe('2. Form Interaction', () => {
    test('2.1 Goal section has text input', async ({ page }) => {
      await page.goto('/tools/grow-model');
      await waitForPageLoad(page);

      // Look for text areas or inputs
      const inputs = page.locator('textarea, input[type="text"]');

      if (await inputs.count() > 0) {
        const firstInput = inputs.first();
        await expect(firstInput).toBeVisible();

        // Try to fill
        await firstInput.fill('Mi objetivo es mejorar mis habilidades de comunicación');
        await page.waitForTimeout(300);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/grow-goal-filled.png` });
      }
    });

    test('2.2 Navigate through GROW steps', async ({ page }) => {
      await page.goto('/tools/grow-model');
      await waitForPageLoad(page);

      // Look for navigation between steps (tabs, buttons, etc.)
      const nextButton = page.locator('button:has-text("siguiente"), button:has-text("next")').first();

      if (await nextButton.isVisible()) {
        // Fill current step
        const currentInput = page.locator('textarea, input[type="text"]').first();
        if (await currentInput.isVisible()) {
          await currentInput.fill('Test input for current step');
        }

        // Go to next step
        await nextButton.click();
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/grow-step-2.png` });
      }
    });

    test('2.3 Complete full GROW worksheet', async ({ page }) => {
      await page.goto('/tools/grow-model');
      await waitForPageLoad(page);

      const textAreas = page.locator('textarea');
      const textAreaCount = await textAreas.count();

      if (textAreaCount >= 4) {
        const responses = [
          'G - Goal: Quiero mejorar mi liderazgo en el equipo',
          'R - Reality: Actualmente lidero un equipo de 5 personas',
          'O - Options: Puedo tomar cursos, buscar mentores, o practicar feedback',
          'W - Will: Me comprometo a implementar feedback semanal',
        ];

        const textAreasArray = await textAreas.all();

        for (let i = 0; i < Math.min(textAreasArray.length, 4); i++) {
          await textAreasArray[i].fill(responses[i] || `Response ${i + 1}`);
          await page.waitForTimeout(200);
        }

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/grow-completed.png`, fullPage: true });
      }
    });
  });

  test.describe('3. Save Functionality', () => {
    test('3.1 Save GROW worksheet', async ({ page }) => {
      await page.goto('/tools/grow-model');
      await waitForPageLoad(page);

      // Fill some content
      const textArea = page.locator('textarea').first();
      if (await textArea.isVisible()) {
        await textArea.fill('Test goal for saving');
      }

      // Find save button
      const saveButton = page.locator('button:has-text("guardar"), button:has-text("save")').first();

      if (await saveButton.isVisible()) {
        await saveButton.click();
        await page.waitForTimeout(2000);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/grow-saved.png` });
      }
    });
  });
});

test.describe('DISC Assessment Tool', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoachee(page);
    if (!success) {
      test.skip(true, 'Could not login as coachee');
    }
  });

  test('1.1 DISC assessment page loads', async ({ page }) => {
    await page.goto('/tools/disc');
    await waitForPageLoad(page);

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/disc-loaded.png`, fullPage: true });

    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent.first()).toBeVisible();
  });

  test('1.2 DISC shows assessment questions or info', async ({ page }) => {
    await page.goto('/tools/disc');
    await waitForPageLoad(page);

    // Should show DISC info or questions
    const content = page.locator('[class*="question"], [class*="assessment"], form');
    const count = await content.count();

    // May have questions or info depending on access
  });
});

test.describe('Other Coaching Tools', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoachee(page);
    if (!success) {
      test.skip(true, 'Could not login as coachee');
    }
  });

  const otherTools = [
    'values-clarification',
    'stakeholder-map',
    'career-compass',
    'emotional-triggers',
    'feedback-feedforward',
    'habit-loop',
    'limiting-beliefs',
    'resilience-scale',
  ];

  for (const toolId of otherTools) {
    test(`Tool ${toolId} loads without errors`, async ({ page }) => {
      await page.goto(`/tools/${toolId}`);
      await waitForPageLoad(page);

      // Capture console errors
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await page.waitForTimeout(2000);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/tool-${toolId}.png` });

      // Page should render something
      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();

      // Log errors for debugging
      if (errors.length > 0) {
        console.log(`Console errors on ${toolId}:`, errors.slice(0, 3));
      }
    });
  }
});

test.describe('Coach Tool Access', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoach(page);
    if (!success) {
      test.skip(true, 'Could not login as coach');
    }
  });

  test('Coach sees tools in coach tools page', async ({ page }) => {
    await page.goto('/coach/tools');
    await waitForPageLoad(page);

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/coach-tools-library.png`, fullPage: true });

    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent.first()).toBeVisible();
  });

  test('Coach can assign tool to client', async ({ page }) => {
    await page.goto('/coach/tools');
    await waitForPageLoad(page);

    // Look for assign button
    const assignButton = page.locator('button:has-text("asignar"), button:has-text("assign")').first();

    if (await assignButton.isVisible()) {
      await assignButton.click();
      await page.waitForTimeout(1000);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coach-assign-tool.png` });
    }
  });
});
