import { test, expect } from '@playwright/test';
import { createServer, type ViteDevServer } from 'vite';
import type { POST as PostHandler } from '../src/pages/api/contact';

// Server-side: a filled honeypot must still notify the owner (flagged), never
// return a fake success. The endpoint is loaded through Vite (Astro's bundler)
// so import.meta.env exists. Resend calls the global fetch, so we stub it here
// and no real email is sent.
test.describe('contact API honeypot', () => {
  let sent: Array<Record<string, unknown>>;
  const realFetch = globalThis.fetch;
  let vite: ViteDevServer;
  let POST: typeof PostHandler;

  test.beforeAll(async () => {
    vite = await createServer({
      configFile: false,
      logLevel: 'silent',
      appType: 'custom',
      server: { middlewareMode: true, hmr: false },
    });
    ({ POST } = await vite.ssrLoadModule('/src/pages/api/contact.ts'));
  });

  test.afterAll(async () => {
    await vite.close();
  });

  test.beforeEach(() => {
    sent = [];
    process.env.RESEND_API_KEY ??= 're_test_dummy';
    globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
      if (!String(url).startsWith('https://api.resend.com/')) {
        throw new Error(`Unexpected fetch in test: ${url}`);
      }
      sent.push(JSON.parse(String(init?.body)));
      return new Response(JSON.stringify({ id: 'test-email-id' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as typeof fetch;
  });

  test.afterEach(() => {
    globalThis.fetch = realFetch;
  });

  async function submit(body: Record<string, string>) {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return POST({ request } as Parameters<typeof PostHandler>[0]);
  }

  const guest = { name: 'Jane Guest', email: 'jane@example.com', message: 'Booking for 6 in May' };

  for (const key of ['tt_hp_7f', 'website']) {
    test(`honeypot "${key}" filled: email is still sent, flagged`, async () => {
      const res = await submit({ ...guest, [key]: 'https://autofilled.example' });

      expect(res.status).toBe(200);
      expect(sent).toHaveLength(1);
      expect(sent[0].subject).toBe('[Possible spam] New inquiry from Jane Guest');
      expect(String(sent[0].text)).toContain('hidden anti-spam field was filled');
      expect(String(sent[0].text)).toContain('Booking for 6 in May');
      expect(String(sent[0].html)).toContain('hidden anti-spam field was filled');
    });
  }

  test('honeypot empty: email sent unflagged', async () => {
    const res = await submit({ ...guest, tt_hp_7f: '' });

    expect(res.status).toBe(200);
    expect(sent).toHaveLength(1);
    expect(sent[0].subject).toBe('New inquiry from Jane Guest');
    expect(String(sent[0].text)).not.toContain('anti-spam');
  });
});

// Client-side: the form posts the renamed honeypot with an autofill-proof setup.
test('contact form sends renamed honeypot field', async ({ page }) => {
  let posted: Record<string, unknown> | undefined;
  await page.route('**/api/contact', async (route) => {
    posted = route.request().postDataJSON();
    await route.fulfill({ status: 200, json: { message: 'Message sent successfully!' } });
  });

  await page.goto('/');
  const honeypot = page.locator('#contact-form input[name="tt_hp_7f"]');
  await expect(honeypot).toHaveAttribute('autocomplete', 'one-time-code');
  await expect(honeypot).toHaveAttribute('tabindex', '-1');
  await expect(page.locator('#contact-form input[name="website"]')).toHaveCount(0);

  await page.locator('#name').fill('Jane Guest');
  await page.locator('#email').fill('jane@example.com');
  await page.locator('#message').fill('Booking for 6 in May');
  await page.locator('#contact-form button[type="submit"]').click();

  await expect.poll(() => posted).toBeTruthy();
  expect(posted).toEqual({
    name: 'Jane Guest',
    email: 'jane@example.com',
    message: 'Booking for 6 in May',
    tt_hp_7f: '',
  });
});
