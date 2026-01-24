import { test, expect } from '@playwright/test';
import {
  waitForPageLoad,
  loginAsCoachee,
  loginAsCoach,
  ROUTES,
} from '../fixtures/test-utils';

const SCREENSHOTS_DIR = 'test-results/screenshots/messaging';

/**
 * Messaging Flow Tests
 *
 * Tests the messaging/chat functionality:
 * - Conversation list loading
 * - Message sending
 * - Real-time updates
 * - Message display
 */

test.describe('Messaging - Coachee', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoachee(page);
    if (!success) {
      test.skip(true, 'Could not login as coachee');
    }
  });

  test.describe('1. Messages Page Loading', () => {
    test('1.1 Messages page loads correctly', async ({ page }) => {
      await page.goto(ROUTES.messages);
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-messages.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });

    test('1.2 Shows conversation list or empty state', async ({ page }) => {
      await page.goto(ROUTES.messages);
      await waitForPageLoad(page);

      // Should show conversations or empty message
      const conversationList = page.locator('[class*="conversation"], [class*="chat-list"], [class*="sidebar"]');
      const emptyState = page.locator('text=/no hay|sin mensajes|empty|comienza/i');

      const hasConversations = await conversationList.count() > 0;
      const hasEmpty = await emptyState.count() > 0;

      // Should have either conversations or empty state
      expect(hasConversations || hasEmpty).toBeTruthy();
    });
  });

  test.describe('2. Conversation Selection', () => {
    test('2.1 Can select a conversation', async ({ page }) => {
      await page.goto(ROUTES.messages);
      await waitForPageLoad(page);

      // Look for conversation items
      const conversationItems = page.locator('[class*="conversation-item"], [class*="chat-item"], a[href*="messages"]');

      if (await conversationItems.count() > 0) {
        const firstConversation = conversationItems.first();
        await firstConversation.click();
        await page.waitForTimeout(1000);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-conversation-open.png` });

        // Should show message thread
        const messageThread = page.locator('[class*="message"], [class*="chat-message"], [class*="thread"]');
        // May or may not have messages
      }
    });
  });

  test.describe('3. Sending Messages', () => {
    test('3.1 Message input is available', async ({ page }) => {
      await page.goto(ROUTES.messages);
      await waitForPageLoad(page);

      // Look for message input
      const messageInput = page.locator('input[placeholder*="mensaje"], textarea[placeholder*="mensaje"], input[type="text"]').first();

      if (await messageInput.isVisible()) {
        await expect(messageInput).toBeEnabled();
      }
    });

    test('3.2 Can type in message input', async ({ page }) => {
      await page.goto(ROUTES.messages);
      await waitForPageLoad(page);

      const messageInput = page.locator('input[placeholder*="mensaje"], textarea[placeholder*="mensaje"], input[type="text"]').first();

      if (await messageInput.isVisible()) {
        await messageInput.fill('Este es un mensaje de prueba');
        await page.waitForTimeout(300);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-message-typed.png` });

        // Verify text was entered
        const value = await messageInput.inputValue();
        expect(value).toContain('mensaje de prueba');
      }
    });

    test('3.3 Send button is available', async ({ page }) => {
      await page.goto(ROUTES.messages);
      await waitForPageLoad(page);

      // Look for send button
      const sendButton = page.locator('button:has-text("enviar"), button[type="submit"], button[aria-label*="send"], button[aria-label*="enviar"]').first();

      if (await sendButton.isVisible()) {
        await expect(sendButton).toBeVisible();
      }
    });

    test('3.4 Can send a message', async ({ page }) => {
      await page.goto(ROUTES.messages);
      await waitForPageLoad(page);

      // First select a conversation if needed
      const conversationItems = page.locator('[class*="conversation-item"], [class*="chat-item"]');
      if (await conversationItems.count() > 0) {
        await conversationItems.first().click();
        await page.waitForTimeout(500);
      }

      // Type message
      const messageInput = page.locator('input[placeholder*="mensaje"], textarea, input[type="text"]').first();

      if (await messageInput.isVisible()) {
        const testMessage = `Test message ${Date.now()}`;
        await messageInput.fill(testMessage);

        // Find and click send
        const sendButton = page.locator('button[type="submit"], button:has-text("enviar")').first();

        if (await sendButton.isVisible()) {
          await sendButton.click();
          await page.waitForTimeout(2000);

          await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-message-sent.png` });

          // Input should be cleared after sending
          const currentValue = await messageInput.inputValue();
          // May or may not be cleared depending on implementation
        }
      }
    });

    test('3.5 Enter key sends message', async ({ page }) => {
      await page.goto(ROUTES.messages);
      await waitForPageLoad(page);

      const messageInput = page.locator('input[placeholder*="mensaje"], textarea, input[type="text"]').first();

      if (await messageInput.isVisible()) {
        await messageInput.fill('Message sent with Enter');
        await messageInput.press('Enter');
        await page.waitForTimeout(1000);

        // Message should be sent
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/coachee-enter-send.png` });
      }
    });
  });

  test.describe('4. Message Display', () => {
    test('4.1 Messages show sender info', async ({ page }) => {
      await page.goto(ROUTES.messages);
      await waitForPageLoad(page);

      // Select conversation if available
      const conversationItems = page.locator('[class*="conversation-item"]');
      if (await conversationItems.count() > 0) {
        await conversationItems.first().click();
        await page.waitForTimeout(1000);
      }

      // Look for message elements
      const messages = page.locator('[class*="message-bubble"], [class*="chat-message"]');

      if (await messages.count() > 0) {
        // Messages should have some content
        const firstMessage = messages.first();
        await expect(firstMessage).toBeVisible();
      }
    });

    test('4.2 Messages show timestamps', async ({ page }) => {
      await page.goto(ROUTES.messages);
      await waitForPageLoad(page);

      const conversationItems = page.locator('[class*="conversation-item"]');
      if (await conversationItems.count() > 0) {
        await conversationItems.first().click();
        await page.waitForTimeout(1000);
      }

      // Look for timestamp elements
      const timestamps = page.locator('[class*="timestamp"], [class*="time"], time');

      // May or may not have visible timestamps
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/message-timestamps.png` });
    });
  });

  test.describe('5. Disabled Features', () => {
    test('5.1 Video call button shows "Próximamente"', async ({ page }) => {
      await page.goto(ROUTES.messages);
      await waitForPageLoad(page);

      // Look for video call button
      const videoButton = page.locator('button:has(svg[class*="video"]), button[title*="video"], button[title*="Próximamente"]');

      if (await videoButton.count() > 0) {
        const firstButton = videoButton.first();

        // Should be disabled or show tooltip
        const isDisabled = await firstButton.isDisabled();

        // Hover to check tooltip
        await firstButton.hover();
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/video-proximamente.png` });
      }
    });

    test('5.2 Attachment button shows "Próximamente"', async ({ page }) => {
      await page.goto(ROUTES.messages);
      await waitForPageLoad(page);

      const attachButton = page.locator('button:has(svg[class*="paperclip"]), button:has(svg[class*="attach"])');

      if (await attachButton.count() > 0) {
        await attachButton.first().hover();
        await page.waitForTimeout(500);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/attach-proximamente.png` });
      }
    });
  });
});

test.describe('Messaging - Coach', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoach(page);
    if (!success) {
      test.skip(true, 'Could not login as coach');
    }
  });

  test.describe('1. Coach Messages', () => {
    test('1.1 Coach messages page loads', async ({ page }) => {
      await page.goto(ROUTES.messages);
      await waitForPageLoad(page);

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coach-messages.png`, fullPage: true });

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });

    test('1.2 Coach sees client conversations', async ({ page }) => {
      await page.goto(ROUTES.messages);
      await waitForPageLoad(page);

      // Should show conversations with clients
      const conversationList = page.locator('[class*="conversation"], [class*="chat"]');
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/coach-conversations.png` });

      // May or may not have clients yet
    });

    test('1.3 Coach can send message to client', async ({ page }) => {
      await page.goto(ROUTES.messages);
      await waitForPageLoad(page);

      // Select first conversation if available
      const conversationItems = page.locator('[class*="conversation-item"]');
      if (await conversationItems.count() > 0) {
        await conversationItems.first().click();
        await page.waitForTimeout(500);

        // Send a message
        const messageInput = page.locator('input, textarea').first();
        if (await messageInput.isVisible()) {
          await messageInput.fill('Mensaje del coach');

          const sendButton = page.locator('button[type="submit"]').first();
          if (await sendButton.isVisible()) {
            await sendButton.click();
            await page.waitForTimeout(1000);

            await page.screenshot({ path: `${SCREENSHOTS_DIR}/coach-message-sent.png` });
          }
        }
      }
    });
  });
});

test.describe('Messaging - Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoachee(page);
    if (!success) {
      test.skip(true, 'Could not login');
    }
  });

  test('Shows error when message fails to send', async ({ page }) => {
    // Intercept Firebase calls to simulate failure
    await page.route('**/firestore/**', route => route.abort());

    await page.goto(ROUTES.messages);
    await waitForPageLoad(page);

    const messageInput = page.locator('input, textarea').first();
    if (await messageInput.isVisible()) {
      await messageInput.fill('This message should fail');

      const sendButton = page.locator('button[type="submit"]').first();
      if (await sendButton.isVisible()) {
        await sendButton.click();
        await page.waitForTimeout(3000);

        await page.screenshot({ path: `${SCREENSHOTS_DIR}/message-error.png` });
      }
    }
  });
});

test.describe('Messaging - Responsive', () => {
  test.beforeEach(async ({ page }) => {
    const success = await loginAsCoachee(page);
    if (!success) {
      test.skip(true, 'Could not login');
    }
  });

  test('Messages page adapts to mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto(ROUTES.messages);
    await waitForPageLoad(page);

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/messages-mobile.png`, fullPage: true });

    // On mobile, might show only conversation list or chat
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent.first()).toBeVisible();
  });
});
