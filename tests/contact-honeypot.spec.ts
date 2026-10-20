import { test, expect } from '@playwright/test';
import { createServer, type ViteDevServer } from 'vite';
import type { POST as PostHandler } from '../src/pages/api/contact';

const guest = { name: 'Jane Guest', email: 'jane@example.com', message: 'Booking for 6 in May' };
const SANDBOX_FROM = 'Timber & Threads Contact <onboarding@resend.dev>';

// Loads the contact endpoint through Vite (Astro's bundler) so import.meta.env
// exists, with `env` set as import.meta.env values. Resend calls the global
// fetch, so we stub it and record payloads: no real email is sent.
function useContactApi(env: Record<string, string> = {}) {
  const sent: Array<Record<string, unknown>> = [];
  const realFetch = globalThis.fetch;
  let vite: ViteDevServer;
  let POST: typeof PostHandler;

  test.beforeAll(async () => {
    vite = await createServer({
      configFile: false,
      logLevel: 'silent',
      appType: 'custom',
      server: { middlewareMode: true, hmr: false },
      define: Object.fromEntries(
        Object.entries(env).map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)])
      ),
    });
    ({ POST } = await vite.ssrLoadModule('/src/pages/api/contact.ts'));
  });

  test.afterAll(async () => {
    await vite.close();
  });

  test.beforeEach(() => {
    sent.length = 0;
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

  return { sent, submit };
}

// A filled honeypot must still notify the owner (flagged), never return a fake success.
test.describe('contact API honeypot', () => {
  const { sent, submit } = useContactApi();

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

  test('CONTACT_FROM unset: sandbox sender, reply goes to the guest', async () => {
    await submit(guest);

    expect(sent[0].from).toBe(SANDBOX_FROM);
    expect(sent[0].reply_to).toBe('jane@example.com');
  });
});

test.describe('contact API sender with CONTACT_FROM set', () => {
  const from = 'Timber & Threads Website <contact@timberandthreadsretreat.com>';
  const { sent, submit } = useContactApi({ CONTACT_FROM: from });

  test('uses CONTACT_FROM, reply goes to the guest', async () => {
    const res = await submit(guest);

    expect(res.status).toBe(200);
    expect(sent).toHaveLength(1);
    expect(sent[0].from).toBe(from);
    expect(sent[0].reply_to).toBe('jane@example.com');
  });
});

test.describe('contact API sender with CONTACT_FROM empty', () => {
  const { sent, submit } = useContactApi({ CONTACT_FROM: '' });

  test('falls back to the sandbox sender', async () => {
    await submit(guest);

    expect(sent[0].from).toBe(SANDBOX_FROM);
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
