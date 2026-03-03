import { test, expect } from '@playwright/test';

// Test 1: Desktop nav click scrolls section heading below header
test('desktop: nav click scrolls #about section below fixed header', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'desktop-1280') {
    test.skip();
  }

  await page.goto('/');

  // Click the desktop nav link for "About"
  await page.locator('header nav a[href="#about"]').click();

  // Wait for smooth scroll to settle — section top should be at or below the 80px fixed header
  await page.waitForFunction(
    () => {
      const section = document.querySelector('#about');
      if (!section) return false;
      const top = section.getBoundingClientRect().top;
      // Section top should be positive (below viewport top) and stable (finished scrolling)
      // scroll-padding-top + scroll-margin-top together place section top ~160px
      return top >= 70;
    },
    { timeout: 3000 }
  );

  const top = await page.evaluate(() => {
    const section = document.querySelector('#about');
    return section ? section.getBoundingClientRect().top : -1;
  });

  // Section must NOT be hidden behind the fixed 80px header (top must be >= 70 with tolerance)
  expect(top).toBeGreaterThanOrEqual(70);
});

test('desktop: nav click scrolls #contact section below fixed header', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'desktop-1280') {
    test.skip();
  }

  await page.goto('/');

  // Click the desktop nav link for "Contact" (far down the page)
  await page.locator('header nav a[href="#contact"]').click();

  // Wait for smooth scroll to settle
  await page.waitForFunction(
    () => {
      const section = document.querySelector('#contact');
      if (!section) return false;
      const top = section.getBoundingClientRect().top;
      return top >= 70;
    },
    { timeout: 3000 }
  );

  const top = await page.evaluate(() => {
    const section = document.querySelector('#contact');
    return section ? section.getBoundingClientRect().top : -1;
  });

  // Section must NOT be hidden behind the fixed 80px header
  expect(top).toBeGreaterThanOrEqual(70);
});

// Test 2: Desktop scroll-spy highlights correct section
test('desktop: scroll-spy highlights accommodations link when section is visible', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'desktop-1280') {
    test.skip();
  }

  await page.goto('/');

  await page.locator('#accommodations').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await expect(page.locator('header nav a[href="#accommodations"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('header nav a[href="#about"]')).toHaveAttribute('aria-current', 'false');
  await expect(page.locator('header nav a[href="#gallery"]')).toHaveAttribute('aria-current', 'false');
});

// Test 3: Desktop scroll-spy transitions cleanly between sections
test('desktop: scroll-spy transitions cleanly between sections', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'desktop-1280') {
    test.skip();
  }

  await page.goto('/');

  // Scroll to #about and verify it is active
  await page.locator('#about').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await expect(page.locator('header nav a[href="#about"]')).toHaveAttribute('aria-current', 'true');

  // Scroll to #gallery and verify transition: gallery is active, about is not
  await page.locator('#gallery').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await expect(page.locator('header nav a[href="#gallery"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('header nav a[href="#about"]')).toHaveAttribute('aria-current', 'false');
});

// Test 4: Mobile menu shows active section indicator
test('mobile: menu shows active section indicator for current section', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'mobile-375') {
    test.skip();
  }

  await page.goto('/');

  // Scroll to #retreats section, wait for scroll-spy to update
  await page.locator('#retreats').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Open mobile menu
  await page.locator('#hamburger-btn').click();
  await expect(page.locator('#mobile-menu')).toBeVisible();

  // The retreats link in mobile menu should be active
  await expect(page.locator('#mobile-menu a[href="#retreats"]')).toHaveAttribute('aria-current', 'true');
  // A different link should not be active
  await expect(page.locator('#mobile-menu a[href="#contact"]')).toHaveAttribute('aria-current', 'false');
});

// Test 5: Mobile nav click scrolls correctly and closes menu
test('mobile: nav click scrolls #gallery section below header and closes menu', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'mobile-375') {
    test.skip();
  }

  await page.goto('/');

  // Open mobile menu
  await page.locator('#hamburger-btn').click();
  await expect(page.locator('#mobile-menu')).toBeVisible();

  // Click the gallery link
  await page.locator('#mobile-menu a[href="#gallery"]').click();

  // Menu should close
  await expect(page.locator('#mobile-menu')).toHaveClass(/hidden/);

  // Wait for smooth scroll to settle — section should be visible below the header
  await page.waitForFunction(
    () => {
      const section = document.querySelector('#gallery');
      if (!section) return false;
      const top = section.getBoundingClientRect().top;
      // Section must be at or below the viewport top (not hidden behind header)
      return top >= 70;
    },
    { timeout: 3000 }
  );

  const top = await page.evaluate(() => {
    const section = document.querySelector('#gallery');
    return section ? section.getBoundingClientRect().top : -1;
  });

  // Section must NOT be hidden behind the fixed header
  expect(top).toBeGreaterThanOrEqual(70);
});
