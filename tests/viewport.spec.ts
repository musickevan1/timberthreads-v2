import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('header brand text visible', async ({ page }) => {
  // Brand text is always visible at all viewports — Phase 9 removed hidden sm:block
  await expect(page.locator('header').getByText('Timber & Threads')).toBeVisible();
});

test('desktop navigation links visible', async ({ page }, testInfo) => {
  // Desktop nav links are hidden md:flex — visible at 1280px, hidden at 375px/320px
  if (testInfo.project.name !== 'desktop-1280') {
    test.skip();
  }
  await expect(page.locator('header nav ul')).toBeVisible();
});

test('pricing calculator section visible', async ({ page }) => {
  await page.locator('#pricing-calculator').scrollIntoViewIfNeeded();
  await expect(page.locator('#pricing-calculator')).toBeVisible();
});

test('Get a Quote button visible', async ({ page }) => {
  // Calculator renders with default values (4 guests, 2 nights) — button is always present
  await page.locator('#pricing-calculator').scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Get a Quote' })).toBeVisible();
});

test('map iframe visible after scroll', async ({ page }) => {
  // Map iframe is lazy-loaded via IntersectionObserver — must scroll into view first
  await page.locator('#maps-iframe').scrollIntoViewIfNeeded();
  await expect(page.locator('#maps-iframe')).toBeVisible();
});

test('contact form visible', async ({ page }) => {
  await page.locator('#contact-form').scrollIntoViewIfNeeded();
  await expect(page.locator('#contact-form')).toBeVisible();
});

test('no horizontal overflow', async ({ page }, testInfo) => {
  // Only check overflow at mobile viewports — desktop intentionally may have wider elements
  if (testInfo.project.name === 'desktop-1280') {
    test.skip();
  }
  const hasOverflow = await page.evaluate(
    () => document.body.scrollWidth > document.documentElement.clientWidth
  );
  expect(hasOverflow).toBe(false);
});

test('Get a Quote pre-fills contact message', async ({ page }) => {
  // Wait for Preact island to hydrate and button to be interactive
  const quoteBtn = page.getByRole('button', { name: 'Get a Quote' });
  await quoteBtn.waitFor({ state: 'visible' });
  await quoteBtn.click();

  // Auto-retry until pre-fill text appears — smooth scroll + 600ms focus timer
  const message = page.locator('#message');
  await expect(message).not.toHaveValue('');

  // Assert specific pre-fill content
  const messageValue = await message.inputValue();
  expect(messageValue).toContain('Group Size:');
  expect(messageValue).toContain('Estimated Total:');
});
