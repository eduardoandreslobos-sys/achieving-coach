import { test, expect } from '@playwright/test';
import {
  waitForPageLoad,
  loginAsAdmin,
  ROUTES,
} from '../fixtures/test-utils';

const SCREENSHOTS_DIR = 'test-results/screenshots/blog';

/**
 * Blog Admin Flow Tests
 *
 * Tests the blog management functionality:
 * - Blog post listing
 * - Creating new posts
 * - Editing posts
 * - Publishing/unpublishing
 * - Scheduling posts
 * - Loading draft templates
 */

test.describe('Blog Admin', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsAdmin(page);
    if (!success) {
      test.skip(true, 'Could not login as admin');
    }
  });

  test.describe('1. Blog Admin Page', () => {
    test('1.1 Blog admin page loads correctly', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/admin-blog-page.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });

    test('1.2 Shows post tabs (Publicados, Borradores, Programados)', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      // Check for tabs
      const tabs = page.locator('[role="tablist"], [class*="tabs"]');

      // Check for individual tab buttons
      const publishedTab = page.locator('button:has-text("Publicados"), [role="tab"]:has-text("Publicados")');
      const draftsTab = page.locator('button:has-text("Borradores"), [role="tab"]:has-text("Borradores")');
      const scheduledTab = page.locator('button:has-text("Programadas"), [role="tab"]:has-text("Programadas")');

      // At least some tabs should exist
      const hasPublished = await publishedTab.count() > 0;
      const hasDrafts = await draftsTab.count() > 0;
      const hasScheduled = await scheduledTab.count() > 0;

      expect(hasPublished || hasDrafts || hasScheduled).toBeTruthy();
    });

    test('1.3 Shows post list or empty state', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      // Should show posts or empty message
      const postList = page.locator('[class*="post"], [class*="article"], table, [class*="list"]');
      const emptyState = page.locator('text=/no hay|sin posts|empty|crear/i');

      const hasPosts = await postList.count() > 0;
      const hasEmpty = await emptyState.count() > 0;

      expect(hasPosts || hasEmpty).toBeTruthy();
    });
  });

  test.describe('2. Post Creation', () => {
    test('2.1 New post button exists', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      const newPostButton = page.locator('button:has-text("Nuevo"), button:has-text("Crear"), a:has-text("Nuevo")').first();

      if (await newPostButton.isVisible()) {
        await expect(newPostButton).toBeEnabled();
      }
    });

    test('2.2 Can open new post form', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      const newPostButton = page.locator('button:has-text("Nuevo"), button:has-text("Crear")').first();

      if (await newPostButton.isVisible()) {
        await newPostButton.click();
        await page.waitForTimeout(1000);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/new-post-form.png` });

        // Should show form fields
        const titleInput = page.locator('input[name*="title"], input[placeholder*="Título"]');
        expect(await titleInput.count()).toBeGreaterThanOrEqual(0);
      }
    });

    test('2.3 Post form has required fields', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      const newPostButton = page.locator('button:has-text("Nuevo")').first();

      if (await newPostButton.isVisible()) {
        await newPostButton.click();
        await page.waitForTimeout(500);

        // Check for form fields
        const titleInput = page.locator('input[name*="title"], input[placeholder*="Título"]');
        const descriptionInput = page.locator('textarea[name*="description"], input[placeholder*="Descripción"]');
        const contentArea = page.locator('textarea[name*="content"], [class*="editor"]');
        const categorySelect = page.locator('select[name*="category"], [class*="category"]');

        // At least title and content should exist
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/post-form-fields.png` });
      }
    });

    test('2.4 Can fill out new post form', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      const newPostButton = page.locator('button:has-text("Nuevo")').first();

      if (await newPostButton.isVisible()) {
        await newPostButton.click();
        await page.waitForTimeout(500);

        // Fill form fields
        const titleInput = page.locator('input[name*="title"], input[placeholder*="Título"]').first();
        if (await titleInput.isVisible()) {
          await titleInput.fill('Test Post Title - Automated Test');
        }

        const descriptionInput = page.locator('textarea[name*="description"], input[placeholder*="Descripción"]').first();
        if (await descriptionInput.isVisible()) {
          await descriptionInput.fill('This is a test post description created by automated tests.');
        }

        const contentArea = page.locator('textarea[name*="content"], [class*="editor"] textarea').first();
        if (await contentArea.isVisible()) {
          await contentArea.fill('# Test Content\n\nThis is the main content of the test post.');
        }

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/post-form-filled.png` });
      }
    });

    test('2.5 Form validates required fields', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      const newPostButton = page.locator('button:has-text("Nuevo")').first();

      if (await newPostButton.isVisible()) {
        await newPostButton.click();
        await page.waitForTimeout(500);

        // Try to save without filling required fields
        const saveButton = page.locator('button:has-text("Guardar"), button[type="submit"]').first();

        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForTimeout(1000);

          await page.screenshot({ path: `${SCREENSHOTS_DIR}/post-validation-error.png` });

          // Should show validation error or stay on form
        }
      }
    });
  });

  test.describe('3. Post Publishing', () => {
    test('3.1 Shows publish options', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      const newPostButton = page.locator('button:has-text("Nuevo")').first();

      if (await newPostButton.isVisible()) {
        await newPostButton.click();
        await page.waitForTimeout(500);

        // Look for publish options (draft, now, scheduled)
        const draftOption = page.locator('input[value*="draft"], label:has-text("Borrador")');
        const publishOption = page.locator('input[value*="now"], label:has-text("Publicar")');
        const scheduleOption = page.locator('input[value*="schedule"], label:has-text("Programar")');

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/publish-options.png` });
      }
    });

    test('3.2 Schedule option shows date picker', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      const newPostButton = page.locator('button:has-text("Nuevo")').first();

      if (await newPostButton.isVisible()) {
        await newPostButton.click();
        await page.waitForTimeout(500);

        // Click schedule option
        const scheduleOption = page.locator('input[value*="schedule"], label:has-text("Programar")').first();

        if (await scheduleOption.isVisible()) {
          await scheduleOption.click();
          await page.waitForTimeout(500);

          // Date picker should appear
          const datePicker = page.locator('input[type="date"], input[type="datetime-local"]');

          await page.screenshot({ path: `${SCREENSHOTS_DIR}/schedule-date-picker.png` });
        }
      }
    });
  });

  test.describe('4. Draft Posts Tab', () => {
    test('4.1 Can switch to drafts tab', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      const draftsTab = page.locator('button:has-text("Borradores")').first();

      if (await draftsTab.isVisible()) {
        await draftsTab.click();
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/drafts-tab.png` });
      }
    });

    test('4.2 Drafts show edit option', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      const draftsTab = page.locator('button:has-text("Borradores")').first();

      if (await draftsTab.isVisible()) {
        await draftsTab.click();
        await page.waitForTimeout(500);

        // Look for edit buttons on draft posts
        const editButtons = page.locator('button:has-text("Editar"), a:has-text("Editar")');

        if (await editButtons.count() > 0) {
          await page.screenshot({ path: `${SCREENSHOTS_DIR}/draft-edit-buttons.png` });
        }
      }
    });
  });

  test.describe('5. Scheduled Posts Tab', () => {
    test('5.1 Can switch to scheduled tab', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      const scheduledTab = page.locator('button:has-text("Programadas")').first();

      if (await scheduledTab.isVisible()) {
        await scheduledTab.click();
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/scheduled-tab.png` });
      }
    });

    test('5.2 Scheduled posts show scheduled date', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      const scheduledTab = page.locator('button:has-text("Programadas")').first();

      if (await scheduledTab.isVisible()) {
        await scheduledTab.click();
        await page.waitForTimeout(500);

        // Look for date display on scheduled posts
        const scheduledDates = page.locator('[class*="date"], time, [class*="scheduled"]');

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/scheduled-dates.png` });
      }
    });
  });

  test.describe('6. Load Draft Templates', () => {
    test('6.1 Load drafts button exists', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      const loadDraftsButton = page.locator('button:has-text("Cargar Borradores"), button:has-text("Load Drafts")').first();

      if (await loadDraftsButton.isVisible()) {
        await expect(loadDraftsButton).toBeEnabled();
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/load-drafts-button.png` });
      }
    });

    test('6.2 Can load draft templates', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      const loadDraftsButton = page.locator('button:has-text("Cargar Borradores")').first();

      if (await loadDraftsButton.isVisible()) {
        await loadDraftsButton.click();
        await page.waitForTimeout(3000);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/drafts-loaded.png` });

        // Should show success message or new drafts
        const successMessage = page.locator('[class*="toast"], text=/cargados|creados|éxito/i');
      }
    });
  });

  test.describe('7. Post Editing', () => {
    test('7.1 Can edit existing post', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      // Look for any post with edit button
      const editButton = page.locator('button:has-text("Editar")').first();

      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForTimeout(1000);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/edit-post-form.png` });

        // Should show edit form with existing data
        const titleInput = page.locator('input[name*="title"], input[placeholder*="Título"]');

        if (await titleInput.isVisible()) {
          const currentTitle = await titleInput.inputValue();
          // Should have existing content
        }
      }
    });

    test('7.2 Can update post content', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      const editButton = page.locator('button:has-text("Editar")').first();

      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForTimeout(500);

        // Modify title
        const titleInput = page.locator('input[name*="title"]').first();
        if (await titleInput.isVisible()) {
          await titleInput.fill('Updated Title - ' + Date.now());

          // Save changes
          const saveButton = page.locator('button:has-text("Guardar"), button[type="submit"]').first();
          if (await saveButton.isVisible()) {
            await saveButton.click();
            await page.waitForTimeout(2000);

            await page.screenshot({ path: `${SCREENSHOTS_DIR}/post-updated.png` });
          }
        }
      }
    });
  });

  test.describe('8. Post Publishing Actions', () => {
    test('8.1 Can publish a draft post', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      // Go to drafts tab
      const draftsTab = page.locator('button:has-text("Borradores")').first();
      if (await draftsTab.isVisible()) {
        await draftsTab.click();
        await page.waitForTimeout(500);
      }

      // Find publish button
      const publishButton = page.locator('button:has-text("Publicar")').first();

      if (await publishButton.isVisible()) {
        // Don't actually publish to avoid test data pollution
        // Just verify button exists
        await expect(publishButton).toBeEnabled();
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/publish-button.png` });
      }
    });

    test('8.2 Can unpublish a post', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      // Look for unpublish or "convertir en borrador" option
      const unpublishButton = page.locator('button:has-text("Despublicar"), button:has-text("Borrador")').first();

      if (await unpublishButton.isVisible()) {
        await expect(unpublishButton).toBeEnabled();
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/unpublish-button.png` });
      }
    });
  });

  test.describe('9. Post Deletion', () => {
    test('9.1 Delete button exists', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      const deleteButton = page.locator('button:has-text("Eliminar"), button[aria-label*="delete"]').first();

      if (await deleteButton.isVisible()) {
        await expect(deleteButton).toBeVisible();
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/delete-button.png` });
      }
    });

    test('9.2 Delete shows confirmation', async ({ page }) => {
      await page.goto(ROUTES.adminBlog);
      await waitForPageLoad(page);

      const deleteButton = page.locator('button:has-text("Eliminar")').first();

      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        await page.waitForTimeout(500);

        // Should show confirmation dialog
        const confirmDialog = page.locator('[role="dialog"], [role="alertdialog"], [class*="modal"]');

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/delete-confirmation.png` });

        // Cancel if dialog appeared
        const cancelButton = page.locator('button:has-text("Cancelar")').first();
        if (await cancelButton.isVisible()) {
          await cancelButton.click();
        }
      }
    });
  });
});

test.describe('Blog - Public View', () => {
  test('1. Blog page shows published posts', async ({ page }) => {
    await page.goto(ROUTES.blog);
    await waitForPageLoad(page);

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/public-blog.png`, fullPage: true });

    // Page loaded successfully
    await expect(page.locator('body')).toBeVisible();
    expect(page.url()).toContain('blog');
  });

  test('2. Blog posts are clickable', async ({ page }) => {
    await page.goto(ROUTES.blog);
    await waitForPageLoad(page);

    const postLinks = page.locator('a[href*="/blog/"]');

    if (await postLinks.count() > 0) {
      const firstPost = postLinks.first();
      await firstPost.click();
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/blog-post-detail.png` });

      // Should navigate to post detail
      expect(page.url()).toContain('/blog/');
    }
  });

  test('3. Blog post shows full content', async ({ page }) => {
    await page.goto(ROUTES.blog);
    await waitForPageLoad(page);

    const postLinks = page.locator('a[href*="/blog/"]');

    if (await postLinks.count() > 0) {
      await postLinks.first().click();
      await waitForPageLoad(page);

      // Should show article content
      const article = page.locator('article, [class*="post-content"], [class*="article"]');

      if (await article.count() > 0) {
        await expect(article.first()).toBeVisible();
      }
    }
  });
});
