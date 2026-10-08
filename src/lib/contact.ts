import { createHash, createHmac } from 'node:crypto';
import { InquiryStore, MAX_ATTEMPTS, SAFE_RETRY_MS, type Inquiry } from './contact-store';

export const CONTACT_BODY_LIMIT = 16 * 1024;
import { INQUIRY_ID } from './contact-id';
export { INQUIRY_ID } from './contact-id';
const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;
const fallback = 'Please try again, or call (417) 343-1473 or email timberandthreads24@gmail.com.';
export type ContactEnvironment = Record<string, string | boolean | undefined>;

export interface ContactConfig { storageUrl: string; storageToken: string; apiKey: string; from: string; to: string }

export function contactStorageConfig(env: ContactEnvironment): Pick<ContactConfig, 'storageUrl' | 'storageToken'> {
  const storageUrl = String(env.UPSTASH_REDIS_REST_URL || '').trim();
  const storageToken = String(env.UPSTASH_REDIS_REST_TOKEN || '').trim();
  const url = new URL(storageUrl);
  if (url.protocol !== 'https:' || !url.hostname.endsWith('.upstash.io') || url.username || url.password || url.search || url.hash || (url.port && url.port !== '443') || (url.pathname !== '/' && url.pathname !== '') || !storageToken) throw new Error('Invalid contact storage configuration');
  return { storageUrl: url.origin, storageToken };
}

export function contactConfig(env: ContactEnvironment): ContactConfig {
  if (env.CONTACT_INTAKE_ENABLED !== 'true') throw new Error('Contact intake disabled');
  const storage = contactStorageConfig(env);
  const apiKey = String(env.RESEND_API_KEY || '').trim();
  const from = String(env.CONTACT_FROM_EMAIL || '').trim();
  const to = String(env.OWNER_EMAIL || '').trim();
  if (!apiKey || !emailPattern.test(from) || !emailPattern.test(to) || from.toLowerCase().endsWith('@resend.dev') || from.length > 254 || to.length > 254) throw new Error('Invalid contact email configuration');
  return { ...storage, apiKey, from, to };
}

function json(status: number, body: object): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}

async function readBody(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Empty body');
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > CONTACT_BODY_LIMIT) { await reader.cancel(); throw new Error('Body too large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function validText(value: unknown, max: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
}

interface NotificationResult { state: 'accepted' | 'pending' | 'failed'; providerId?: string; errorCode?: string }

function notificationBody(id: string, payload: {name: string; email: string; message: string}, config: ContactConfig): string {
  return JSON.stringify({
    from: config.from, to: [config.to], reply_to: payload.email,
    subject: `Retreat inquiry ${id}`,
    html: `<h2>New inquiry from ${escapeHtml(payload.name)}</h2><p>Reply to: ${escapeHtml(payload.email)}</p><p>${escapeHtml(payload.message).replace(/\n/g, '<br>')}</p><p>Reference: ${id}</p>`,
    text: `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}\n\nReference: ${id}`,
  });
}

async function sendNotification(record: Inquiry, apiKey: string, fetcher: typeof fetch): Promise<NotificationResult> {
  try {
    const response = await fetcher('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `contact/${record.id}` },
      body: record.notificationBody, signal: AbortSignal.timeout(3000),
    });
    const data = await response.json().catch(() => ({})) as { id?: unknown };
    if (response.ok && typeof data.id === 'string' && data.id.length > 0) return { state: 'accepted', providerId: data.id };
    // An ambiguous successful response or temporary provider failure remains retryable.
    const transient = response.ok || response.status === 408 || response.status === 409 || response.status === 429 || response.status >= 500;
    return { state: transient ? 'pending' : 'failed', errorCode: transient ? 'provider_unavailable' : 'provider_rejected' };
  } catch { return { state: 'pending', errorCode: 'provider_response_unknown' }; }
}

export async function notifyInquiry(store: InquiryStore, id: string, config: ContactConfig,
  fetcher: typeof fetch = fetch, now: () => number = Date.now,
  pause: (ms: number) => Promise<void> = ms => new Promise(resolve => setTimeout(resolve, ms))): Promise<'accepted' | 'pending'> {
  // At most two attempts here; the durable cap also applies to later operator retries.
  for (let pass = 0; pass < 2; pass++) {
    const record = await store.claim(id, now());
    if (!record) return (await store.get(id))?.notification === 'accepted' ? 'accepted' : 'pending';
    const result = await sendNotification(record, config.apiKey, fetcher);
    const state = result.state === 'pending' && record.attempts >= MAX_ATTEMPTS ? 'review' : result.state;
    await store.finish(record, state, result.providerId, result.errorCode);
    if (result.state === 'accepted') return 'accepted';
    if (result.state !== 'pending' || record.attempts >= MAX_ATTEMPTS) return 'pending';
    if (pass === 0) await pause(250);
  }
  return 'pending';
}

export function createContactHandler(env: ContactEnvironment,
  options: { fetcher?: typeof fetch; now?: () => number; pause?: (ms: number) => Promise<void> } = {}) {
  const fetcher = options.fetcher || fetch;
  const now = options.now || Date.now;
  return async (request: Request, clientAddress = ''): Promise<Response> => {
    if (request.method !== 'POST') return json(405, { accepted: false, message: 'Use the contact form to submit an inquiry.' });
    const origin = request.headers.get('origin');
    if (!origin || origin !== new URL(request.url).origin) return json(403, { accepted: false, message: 'Please submit the form from this website.' });
    if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return json(415, { accepted: false, message: 'Invalid request format. ' + fallback });
    const id = request.headers.get('idempotency-key') || '';
    if (!INQUIRY_ID.test(id)) return json(400, { accepted: false, message: 'Please reload the page and try again.' });
    const submittedAt = Number(request.headers.get('x-contact-created-at'));
    if (!Number.isFinite(submittedAt) || submittedAt <= 0 || now() - submittedAt >= SAFE_RETRY_MS || submittedAt - now() > 5 * 60 * 1000) return json(409, { accepted: false, message: 'This draft is too old to retry safely, or your device clock is incorrect. Please call or email us with your original reference instead of resubmitting it.' });
    let body: unknown;
    try { body = await readBody(request); } catch { return json(400, { accepted: false, message: 'Invalid or oversized request. ' + fallback }); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return json(400, { accepted: false, message: 'Invalid request. ' + fallback });
    const fields = body as Record<string, unknown>;
    if (typeof fields.website !== 'string' || fields.website !== '') return json(400, { accepted: false, message: 'Please leave the Website field blank and try again. ' + fallback });
    if (!validText(fields.name, 100) || /[\r\n\x00-\x1f\x7f]/.test(fields.name) || !validText(fields.email, 254) || /[\x00-\x1f\x7f]/.test(fields.email) || !emailPattern.test(fields.email.trim()) || !validText(fields.message, 5000) || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(fields.message)) {
      return json(400, { accepted: false, message: 'Enter your name (up to 100 characters), a valid email, and a message (up to 5,000 characters).' });
    }
    let config: ContactConfig;
    try { config = contactConfig(env); } catch { return json(503, { accepted: false, message: 'The contact form is temporarily unavailable. ' + fallback }); }
    const payload = { name: fields.name.trim(), email: fields.email.trim(), message: fields.message.trim() };
    const fingerprint = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    const record: Inquiry = { id, fingerprint, createdAt: now(), ...payload, from: config.from, to: config.to,
      notificationBody: notificationBody(id, payload, config), notification: 'pending', attempts: 0 };
    const store = new InquiryStore(config.storageUrl, config.storageToken, fetcher);
    let outcome: Awaited<ReturnType<InquiryStore['accept']>>;
    try {
      const clientHash = createHmac('sha256', config.storageToken).update(clientAddress || 'unknown').digest('hex');
      outcome = await store.accept(record, clientHash);
    } catch {
      return json(503, { accepted: false, message: 'We could not confirm your inquiry was saved. Your draft is still here; retrying it is safe. ' + fallback });
    }
    if (outcome.outcome === 'conflict') return json(409, { accepted: false, message: 'This reference already belongs to a different draft. Reload the page before sending a new inquiry.' });
    if (outcome.outcome === 'limited') return json(429, { accepted: false, message: 'Too many inquiries right now. Please wait before retrying, or contact us directly. ' + fallback });
    if (!outcome.record || !['created', 'existing'].includes(outcome.outcome)) return json(503, { accepted: false, message: 'We could not confirm your inquiry was saved. ' + fallback });
    let notification: 'accepted' | 'pending' = 'pending';
    try { notification = await notifyInquiry(store, id, config, fetcher, now, options.pause); }
    catch { /* Inquiry is already durable. A lost status update is recoverable with the same key. */ }
    return json(outcome.outcome === 'created' ? 201 : 200, {
      accepted: true, reference: id, notification,
      message: notification === 'accepted'
        ? 'Your inquiry has been saved. We’ll get back to you soon.'
        : 'Your inquiry has been saved, but we could not confirm the email notification. Please call or email us and quote your reference if you need a prompt reply.',
    });
  };
}
