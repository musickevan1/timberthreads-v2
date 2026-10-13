import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://127.0.0.1:${process.env.TEST_PORT || 4321}`,
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } : undefined,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run build && node scripts/serve-test.mjs',
    url: `http://127.0.0.1:${process.env.TEST_PORT || 4321}`,
    timeout: 120_000,
    reuseExistingServer: false,
  },
  projects: [
    {
      name: 'desktop-1280',
      use: {
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'mobile-375',
      use: {
        viewport: { width: 375, height: 812 },
      },
    },
    {
      name: 'mobile-320',
      use: {
        viewport: { width: 320, height: 568 },
      },
    },
  ],
});
