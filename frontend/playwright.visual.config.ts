import { defineConfig, devices } from '@playwright/test';

/**
 * Visual inspection config - no webServer, assumes server is already running
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: false,
  retries: 0,
  workers: 4,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'off',
    screenshot: 'on',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // No webServer - expects server to already be running
});
