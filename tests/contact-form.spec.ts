import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin === new URL(test.info().project.use.baseURL!).origin) return route.continue();
    return route.abort();
  });
  await page.goto('/');
  await expect(page.locator('#submit-btn')).toBeEnabled();
});

async function fill(page: import('@playwright/test').Page) {
  await page.locator('#name').fill('Sandbox Guest');
  await page.locator('#email').fill('guest@example.test');
  await page.locator('#message').fill('Synthetic inquiry only');
}

test('invalid fields show associated errors without sending', async ({ page }) => {
  let requests = 0;
  await page.route('**/api/contact', route => { requests++; return route.abort(); });
  await page.locator('#submit-btn').click();
  await expect(page.locator('#name')).toBeFocused();
  await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#name-error')).toBeVisible();
  expect(requests).toBe(0);
});

test('durable acceptance displays reference and clears session draft', async ({ page }) => {
  await page.route('**/api/contact', route => route.fulfill({
    status: 201, json: { accepted: true, reference: route.request().headers()['idempotency-key'], notification: 'accepted', message: 'Your inquiry has been saved.' },
  }));
  await fill(page);
  await page.locator('#submit-btn').click();
  await expect(page.locator('#success-message')).toBeVisible();
  await expect(page.locator('#success-message')).toBeFocused();
  await expect(page.locator('#success-text')).toContainText('Reference:');
  await expect(page.locator('#contact-form')).toBeHidden();
  expect(await page.evaluate(() => sessionStorage.getItem('timberthreads:contact-draft:v1'))).toBeNull();
});

test('saved inquiry with notification failure displays useful partial success', async ({ page }) => {
  await page.route('**/api/contact', route => route.fulfill({ status: 201, json: {
    accepted: true, reference: route.request().headers()['idempotency-key'], notification: 'pending',
    message: 'Your inquiry has been saved, but we could not confirm the email notification. Please call or email us and quote your reference.',
  } }));
  await fill(page); await page.locator('#submit-btn').click();
  await expect(page.locator('#success-text')).toContainText('could not confirm the email');
  await expect(page.locator('#success-text')).toContainText('Reference:');
});

for (const failure of ['storage', 'network', 'malformed-success']) {
  test(`${failure} preserves draft and retries with the same token even after reload`, async ({ page }) => {
    const keys: string[] = [];
    await page.route('**/api/contact', route => {
      keys.push(route.request().headers()['idempotency-key']);
      if (failure === 'network') return route.abort('failed');
      if (failure === 'malformed-success') return route.fulfill({ status: 200, body: '<html>not accepted</html>', contentType: 'text/html' });
      return route.fulfill({ status: 503, json: { accepted: false, message: 'We could not confirm your inquiry was saved. Retrying it is safe.' } });
    });
    await fill(page); await page.locator('#submit-btn').click();
    await expect(page.locator('#error-message')).toBeVisible();
    await expect(page.locator('#message')).toHaveValue('Synthetic inquiry only');
    await expect(page.locator('#submit-btn')).toBeEnabled();
    await page.reload();
    await expect(page.locator('#submit-btn')).toBeEnabled();
    await expect(page.locator('#message')).toHaveValue('Synthetic inquiry only');
    await page.locator('#submit-btn').click();
    await expect.poll(() => keys.length).toBe(2);
    expect(keys[0]).toMatch(/^[0-9a-f-]{36}$/); expect(keys[1]).toBe(keys[0]);
  });
}

test('repeated submit events start only one request while busy', async ({ page }) => {
  let requests = 0;
  let release: (() => void) | undefined;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/api/contact', async route => {
    requests++; await held;
    return route.fulfill({status:503,json:{accepted:false,message:'Try again.'}});
  });
  await fill(page);
  await page.locator('#contact-form').evaluate((form: HTMLFormElement) => { form.requestSubmit(); form.requestSubmit(); });
  await expect.poll(() => requests).toBe(1);
  await expect(page.locator('#contact-form')).toHaveAttribute('aria-busy', 'true');
  await expect(page.locator('#submit-btn')).toBeDisabled();
  release!();
  await expect(page.locator('#submit-btn')).toBeEnabled();
  expect(requests).toBe(1);
});

test('an edited uncertain draft cannot silently create another inquiry, including after reload', async ({ page }) => {
  const attempts: { key: string; body: unknown; createdAt: string }[] = [];
  await page.route('**/api/contact', route => {
    attempts.push({key:route.request().headers()['idempotency-key'],body:route.request().postDataJSON(),createdAt:route.request().headers()['x-contact-created-at']});
    return route.abort('failed');
  });
  await fill(page); await page.locator('#submit-btn').click();
  await expect(page.locator('#error-message')).toBeVisible();
  await page.reload(); await expect(page.locator('#submit-btn')).toBeEnabled();
  await page.locator('#message').fill('Edited after unknown acceptance');
  await page.locator('#submit-btn').click();
  await expect(page.getByRole('button', {name:'Retry original draft'})).toBeVisible();
  await expect(page.locator('#message')).toHaveValue('Edited after unknown acceptance');
  expect(attempts).toHaveLength(1);
  await page.getByRole('button', {name:'Retry original draft'}).click();
  await expect.poll(() => attempts.length).toBe(2);
  expect(attempts[1]).toEqual(attempts[0]);
});

test('a definite first-attempt rejection allows a corrected draft with a new reference', async ({ page }) => {
  const keys: string[] = [];
  await page.route('**/api/contact', route => {
    keys.push(route.request().headers()['idempotency-key']);
    return route.fulfill({status:400,json:{accepted:false,message:'Correct this draft.'}});
  });
  await fill(page); await page.locator('#submit-btn').click();
  await expect(page.locator('#error-message')).toContainText('Correct this draft.');
  await page.locator('#message').fill('Corrected inquiry');
  await page.locator('#submit-btn').click();
  await expect.poll(() => keys.length).toBe(2);
  expect(keys[1]).not.toBe(keys[0]);
});

test('hung request times out with draft and idempotency token retained', async ({ page }) => {
  await page.clock.install();
  await page.route('**/api/contact', async () => { /* Browser aborts after its own bounded timeout. */ });
  await fill(page); await page.locator('#submit-btn').click();
  await page.clock.fastForward(26000);
  await expect(page.locator('#error-message')).toContainText('connection was interrupted');
  await expect(page.locator('#message')).toHaveValue('Synthetic inquiry only');
  await expect(page.locator('#submit-btn')).toBeEnabled();
  expect(await page.evaluate(() => sessionStorage.getItem('timberthreads:contact-draft:v1'))).not.toBeNull();
});

test('published street number stays 307 and map destination coordinates stay unchanged', async ({ page }) => {
  await expect(page.locator('#contact')).toContainText('307 NW 300 Rd, Clinton, MO 64735');
  await expect(page.locator('#location')).toContainText('307 NW 300 Rd, Clinton, MO 64735');
  await expect(page.locator('#maps-iframe')).toHaveAttribute('data-src', /!2s307%20NW%20300%20Rd!3m2!1d38\.4101236!2d-93\.8125944!/);
});
