# Phase 4: Contact Form and Server Endpoint - Research

**Researched:** 2026-02-17
**Domain:** Astro API endpoints, Resend email SDK, vanilla JS form handling, honeypot spam prevention
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Contact section layout
- Side-by-side layout: contact info (phone, email, address) on the left, form on the right — stacks vertically on mobile
- All contact methods given equal weight — no single method is prioritized over others
- Icons alongside each contact detail (phone icon, email icon, map pin) — consistent with inline Heroicons SVG pattern used in other sections
- Address includes a "Get directions" link that scrolls to the existing Map section

#### Form experience
- Submit button shows a spinner and is disabled during submission — important for slow rural connections
- On error (network or server), form preserves all user input so they can retry without retyping
- Submit button text: "Send Message"

#### Tone and prompts
- Section heading: "Get in Touch"
- Warm 1-2 sentence intro paragraph under the heading (e.g., "Ready to plan your retreat? We'd love to hear from you.")
- Message field placeholder with suggestions: something like "Tell us about your group, preferred dates, or any questions..."

#### Section integration
- Replaces the current Connect section but keeps the Facebook social card
- Layout: contact info + form (side by side) at top, Facebook card below as an alternative way to connect
- Facebook card stays roughly as-is in appearance and prominence
- Switch from `output: 'static'` to `output: 'hybrid'` in astro.config.mjs — all existing pages remain static/prerendered, only the /api/contact endpoint runs as a Vercel serverless function

#### Claude's Discretion
- Validation approach (inline under fields vs on-submit — pick what's best for a 3-field form targeting an older demographic)
- Success state pattern (inline replacement vs toast — pick what's most appropriate)
- Section ID and nav label handling (keep scroll-spy working)
- Intro paragraph exact wording

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CNTC-01 | Contact section with phone number, email address, and physical address | Contact info display pattern; tel: link for mobile click-to-call; inline Heroicons SVG icons |
| CNTC-02 | Contact form with name, email, and message fields with client-side validation | On-blur + on-submit validation pattern; vanilla JS in Astro `<script>` block |
| CNTC-03 | Server endpoint (POST /api/contact) with server-side validation and email delivery via Resend | `src/pages/api/contact.ts` with `export const prerender = false`; Resend `resend` npm package v6.x |
| CNTC-04 | Honeypot field for basic spam prevention | CSS off-screen hidden field with innocuous name; server-side check in endpoint |
| CNTC-05 | Success/error feedback displayed to user after form submission | Inline success state replacing form; error banner above form preserving inputs |
| CNTC-06 | Email credentials stored in environment variables, never exposed to client | `import.meta.env.RESEND_API_KEY` in server endpoint; no `PUBLIC_` prefix |
</phase_requirements>

---

## Summary

This phase adds the site's only server-side feature: a contact form that submits to an Astro API endpoint, which delivers email via the Resend SDK. The architecture is vanilla JS in an Astro `<script>` block (no React needed for a 3-field form) plus a single TypeScript server endpoint at `src/pages/api/contact.ts`.

**Critical finding about `output: 'hybrid'`:** The CONTEXT.md decision to switch to `output: 'hybrid'` is invalid in Astro 5. In Astro 5, `output: 'hybrid'` was removed and merged into `output: 'static'`. The correct approach is to **keep `output: 'static'`** in `astro.config.mjs` and add `export const prerender = false` to the API endpoint file. All existing pages continue to be statically rendered, and the `@astrojs/vercel` adapter (already installed as v9.0.4) handles the serverless function automatically. No `astro.config.mjs` changes are needed beyond this understanding — the adapter and output mode are already correct.

The Resend SDK (`resend` npm package, current version v6.9.2) uses a simple `{ data, error }` return pattern. Sending requires a verified custom domain in production (Resend's free tier: 3,000 emails/month, 100/day). For the API key, use `import.meta.env.RESEND_API_KEY` in the server endpoint — no `PUBLIC_` prefix, so it is never exposed to the client. The honeypot is a plain CSS off-screen hidden field with an innocuous name checked server-side.

For UX at Claude's discretion: use **on-blur + on-submit validation** (not instant inline) for this 3-field form targeting older users — instant validation while typing interrupts focus and causes errors. For success state, use **inline section replacement** (the form area becomes a warm confirmation message) rather than a toast — inline is unambiguous on slow rural connections where a dismissible toast may disappear before they notice it.

**Primary recommendation:** Keep `output: 'static'`, add `export const prerender = false` to `src/pages/api/contact.ts`, install `resend`, use vanilla JS form handler in a `<script>` block in Contact.astro.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `resend` | ^6.9.2 | Transactional email delivery | Vercel serverless compatible, simple `{ data, error }` API, no SMTP config |
| Astro server endpoint | (built-in) | POST /api/contact handler | Native Astro pattern, no extra deps, TypeScript-typed via `APIRoute` |
| Vanilla JS in `<script>` | (built-in) | Form submission, spinner, feedback | 3-field form does not justify React (~40KB) per prior decision |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@astrojs/vercel` | ^9.0.4 (already installed) | Vercel serverless adapter | Required for API routes on Vercel — already present |
| `import.meta.env` | (Astro built-in) | Server-side env var access | Secret API key, never `PUBLIC_` prefixed |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Resend | Nodemailer | Nodemailer requires SMTP creds and is harder to configure on serverless; Resend locked in by prior decisions |
| Vanilla JS | React island | React adds ~40KB; 3 fields don't need component state management — locked out by prior decision |
| Inline success state | Toast notification | Toast can disappear on slow connections before user sees it; inline replacement is more reliable |

**Installation:**
```bash
npm install resend
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   └── Contact.astro        # New component — replaces Connect.astro
├── pages/
│   ├── index.astro           # Replace <Connect /> with <Contact /> import
│   └── api/
│       └── contact.ts        # POST endpoint: export const prerender = false
```

The file `src/pages/api/contact.ts` becomes `/api/contact` in production. Astro strips the `.ts` extension. No subfolder configuration needed beyond the file existing in `src/pages/`.

### Pattern 1: Astro 5 Hybrid Static Site with Single Server Endpoint

**What:** Keep `output: 'static'` in astro.config.mjs. Entire site stays statically generated. Only the API endpoint opts out of prerendering via `export const prerender = false`. The `@astrojs/vercel` adapter (already installed) automatically deploys this as a Vercel serverless function.

**When to use:** When 1 route needs server-side execution on a otherwise static site — exactly this project's case.

**Key fact:** In Astro 5, `output: 'hybrid'` no longer exists. `output: 'static'` now includes the old hybrid capability built-in. Adding `export const prerender = false` to any route opts it out of static generation.

```typescript
// Source: https://docs.astro.build/en/guides/upgrade-to/v5/
// src/pages/api/contact.ts

export const prerender = false;  // THIS is what makes it serverless

export const POST: APIRoute = async ({ request }) => {
  // handler here
};
```

**astro.config.mjs stays unchanged:**
```javascript
// Source: https://vercel.com/docs/frameworks/frontend/astro
// No changes needed to astro.config.mjs
// output: 'static' already works; @astrojs/vercel adapter already installed
export default defineConfig({
  output: 'static',   // Keep as-is
  adapter: vercel(),  // Keep as-is
  // ...
});
```

### Pattern 2: Astro Server Endpoint for POST

**What:** A TypeScript file in `src/pages/api/` that exports named async functions matching HTTP methods. Returns `new Response(JSON.stringify(...), { status: ... })`.

**When to use:** All server-side logic that cannot run at build time.

```typescript
// Source: https://docs.astro.build/en/guides/endpoints/
// src/pages/api/contact.ts

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  // 1. Honeypot check
  if (body.website) {
    return new Response(JSON.stringify({ message: 'Bot detected' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. Server-side validation
  const { name, email, message } = body;
  if (!name || !email || !message) {
    return new Response(JSON.stringify({ message: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. Send email via Resend
  const resend = new Resend(import.meta.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: 'Contact Form <noreply@timberandthreadsretreat.com>',
    to: import.meta.env.OWNER_EMAIL,
    replyTo: email,
    subject: `New inquiry from ${name}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  });

  if (error) {
    return new Response(JSON.stringify({ message: 'Failed to send message. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ message: 'Message sent successfully!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### Pattern 3: Vanilla JS Form Handler in Astro `<script>` Block

**What:** Astro `<script>` blocks are bundled by Vite and run client-side. Can query the DOM and attach event listeners. No framework needed.

**When to use:** Lightweight interactivity without the React weight (~40KB) penalty. Matches project's existing pattern (Gallery.astro, Nav.astro, Map.astro all use `<script>` blocks).

```javascript
// Source: https://docs.astro.build/en/guides/client-side-scripts/
// Inside Contact.astro <script> block

const form = document.getElementById('contact-form') as HTMLFormElement;
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
const btnText = document.getElementById('btn-text') as HTMLSpanElement;
const btnSpinner = document.getElementById('btn-spinner') as HTMLSpanElement;
const successMsg = document.getElementById('success-message') as HTMLDivElement;
const errorMsg = document.getElementById('error-message') as HTMLDivElement;

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Clear error, disable button, show spinner
  errorMsg.classList.add('hidden');
  submitBtn.disabled = true;
  btnText.textContent = 'Sending...';
  btnSpinner.classList.remove('hidden');

  const formData = new FormData(form);
  const body = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    website: formData.get('website'), // honeypot
  };

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      // Show success, hide form
      form.classList.add('hidden');
      successMsg.classList.remove('hidden');
    } else {
      // Show error — inputs preserved automatically (no reset)
      const data = await res.json();
      errorMsg.textContent = data.message || 'Something went wrong. Please try again.';
      errorMsg.classList.remove('hidden');
    }
  } catch {
    errorMsg.textContent = 'Network error. Please check your connection and try again.';
    errorMsg.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = 'Send Message';
    btnSpinner.classList.add('hidden');
  }
});
```

### Pattern 4: Honeypot Hidden Field

**What:** A form field hidden from real users via CSS off-screen positioning. Bots fill all fields; the server checks this field and rejects any submission where it has a value.

**Implementation:**
```html
<!-- Hidden from human users, not from bots -->
<!-- Use an innocuous name — not "honeypot" or "trap" -->
<div class="absolute left-[-9999px] top-0 overflow-hidden h-0 w-0" aria-hidden="true">
  <label for="website">Website (leave blank)</label>
  <input
    type="text"
    id="website"
    name="website"
    tabindex="-1"
    autocomplete="off"
  />
</div>
```

**CSS hiding approach:** Off-screen absolute positioning is more reliable than `display: none` (some bots detect display:none and skip those fields). The combined approach — off-screen + `h-0 w-0` + `overflow-hidden` — catches both naive bots and more sophisticated ones.

### Pattern 5: On-Blur + On-Submit Validation (Recommended for Older Users)

**What:** Validate each field when the user leaves it (blur), and re-validate all fields on submit. Do NOT validate while the user is actively typing.

**Why for this audience:** Instant keystroke validation interrupts focus and causes errors for users who type slowly or hunt-and-peck. On-blur gives feedback at a natural pause point. This is the UX research consensus for simple short forms.

```javascript
// Validation on blur (not on input)
const emailInput = document.getElementById('email') as HTMLInputElement;
const emailError = document.getElementById('email-error') as HTMLSpanElement;

emailInput?.addEventListener('blur', () => {
  if (emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
    emailError.textContent = 'Please enter a valid email address';
    emailError.classList.remove('hidden');
  } else {
    emailError.classList.add('hidden');
  }
});
```

### Anti-Patterns to Avoid

- **`output: 'hybrid'` in astro.config.mjs:** Not valid in Astro 5. Using it will cause a build error. Keep `output: 'static'` and use `export const prerender = false` on the endpoint.
- **`PUBLIC_RESEND_API_KEY`:** The `PUBLIC_` prefix exposes the variable to client-side JavaScript. Resend API keys must never be `PUBLIC_` prefixed.
- **Resend instantiated at module level:** In serverless environments, the module may be cached between requests. Instantiate `new Resend(...)` inside the handler function, or at module level (it's stateless so either works, but inside is explicit).
- **Resetting form fields on error:** If the fetch fails, do not call `form.reset()`. Let the inputs retain their values so users can retry.
- **`display: none` for honeypot:** Some sophisticated bots detect and skip `display: none` fields. Use off-screen CSS positioning instead.
- **Using `request.formData()` instead of `request.json()`:** The form submits as JSON (via fetch with `Content-Type: application/json`). Use `request.json()` in the endpoint. Only use `request.formData()` for traditional HTML form POST without JavaScript.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email delivery | Custom SMTP client / nodemailer | `resend` npm package | SMTP is blocked on Vercel serverless; Resend is HTTP-based and works everywhere |
| Email deliverability | Manual SPF/DKIM/DMARC setup | Resend handles DNS config, domain verification | Getting into inboxes requires authentication records Resend manages |
| Rate limiting on the API endpoint | Custom in-memory counter | Vercel function invocation limits | For a low-traffic retreat site, Resend's 100 emails/day free limit is the effective rate limit |
| CSRF protection | Custom token scheme | Honeypot + JSON Content-Type | JSON fetch endpoints are not vulnerable to CSRF from traditional form-based attacks; honeypot handles bot spam |

**Key insight:** Email delivery is a solved problem. The complexity is all in deliverability (DNS records, IP reputation, bounce handling) — Resend handles all of this. The only custom code needed is the API endpoint and the client-side form handler.

---

## Common Pitfalls

### Pitfall 1: Using `output: 'hybrid'` in Astro 5

**What goes wrong:** `astro.config.mjs` with `output: 'hybrid'` causes a build error or warning in Astro 5. The option was removed in Astro 5.0.

**Why it happens:** The CONTEXT.md mentions switching to `output: 'hybrid'`, which was the correct Astro 4 approach. In Astro 5, hybrid was merged into static.

**How to avoid:** Keep `output: 'static'`. Add `export const prerender = false` only to `src/pages/api/contact.ts`. All other pages continue to be statically rendered.

**Warning signs:** Build output mentions unknown output mode; TypeScript errors on the output field type.

### Pitfall 2: Resend `from` Address Domain Not Verified

**What goes wrong:** Resend rejects sends with "domain not verified" error at runtime. The API call succeeds in dev (using `onboarding@resend.dev` test address) but fails in production with a real domain.

**Why it happens:** Resend requires DNS records (SPF + DKIM) on the sending domain before emails can be sent from it. Free plan allows 1 domain.

**How to avoid:** Before deploying, verify the sending domain in the Resend dashboard and add the DNS records. Use `noreply@timberandthreadsretreat.com` or a subdomain as the `from` address. For dev testing, use `delivered@resend.dev` as the `to` address (Resend's test sink address).

**Warning signs:** `{ error: { name: 'validation_error', message: 'Domain is not verified' } }` in Resend response.

### Pitfall 3: Resend API Key Exposed to Client

**What goes wrong:** If the key is named `PUBLIC_RESEND_API_KEY`, Astro/Vite includes it in the client-side JavaScript bundle. Anyone can extract it from the browser and send emails through your account.

**Why it happens:** Astro's Vite config exposes any variable prefixed with `PUBLIC_` to the client.

**How to avoid:** Name the variable `RESEND_API_KEY` (no `PUBLIC_` prefix). Access it only in `src/pages/api/contact.ts` via `import.meta.env.RESEND_API_KEY`. Never reference it in `.astro` component frontmatter that renders to the page.

**Warning signs:** API key appears in browser DevTools > Sources > bundle JS files.

### Pitfall 4: Form Inputs Reset on Error

**What goes wrong:** The user writes a long message, hits submit, gets a network error, and their message is gone.

**Why it happens:** Calling `form.reset()` or navigating away clears inputs. Common mistake is resetting the form on any response (success or error).

**How to avoid:** Only reset the form (or hide it) on `res.ok === true`. On error, just show the error message above the form and re-enable the submit button. The inputs retain their values automatically.

**Warning signs:** User has to retype their message after a failed submission.

### Pitfall 5: Section ID Conflict Breaking Scroll-Spy

**What goes wrong:** If Contact.astro uses `id="connect"` (matching old component) instead of `id="contact"`, the nav link `href="#contact"` won't scroll there. If the ID changes, the scroll-spy `navLinks` won't find a matching link.

**Why it happens:** The Nav.astro has `{ label: 'Contact', href: '#contact' }`. The existing Connect.astro has `id="contact"`. The new Contact.astro must preserve `id="contact"` exactly.

**How to avoid:** Use `<section id="contact" ...>` in the new Contact.astro. No changes needed to Nav.astro or scroll-spy.js — the section replaces Connect.astro but keeps the same ID.

**Warning signs:** Nav "Contact" link doesn't scroll to the section; no scroll-spy highlight when contact section is visible.

### Pitfall 6: Spinner Inline SVG Needs CSS Animation

**What goes wrong:** A static SVG circle rendered as the spinner doesn't spin — it just appears as a static icon.

**Why it happens:** Spinners require CSS animation (`animate-spin` in Tailwind) or `@keyframes` rotation. Without it, the element is invisible or static.

**How to avoid:** Use Tailwind's `animate-spin` class on a circular SVG. Keep it hidden by default (`hidden` class) and only remove `hidden` during submission.

```html
<!-- Spinner SVG — Tailwind animate-spin handles rotation -->
<span id="btn-spinner" class="hidden">
  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
  </svg>
</span>
```

---

## Code Examples

### Complete API Endpoint

```typescript
// Source: https://docs.astro.build/en/guides/endpoints/ + https://resend.com/nodejs
// src/pages/api/contact.ts

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, string>;

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ message: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Honeypot check — bots fill this, humans don't see it
  if (body.website) {
    // Return 200 to avoid telling bots they were caught
    return new Response(JSON.stringify({ message: 'Message sent successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Server-side validation
  const { name, email, message } = body;
  const errors: string[] = [];

  if (!name?.trim()) errors.push('Name is required');
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required');
  if (!message?.trim()) errors.push('Message is required');

  if (errors.length > 0) {
    return new Response(JSON.stringify({ message: errors.join('. ') }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Send email
  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: 'Timber & Threads Contact <noreply@timberandthreadsretreat.com>',
    to: [import.meta.env.OWNER_EMAIL],
    replyTo: email,
    subject: `New inquiry from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
    text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
  });

  if (error) {
    console.error('Resend error:', error);
    return new Response(JSON.stringify({ message: 'Failed to send your message. Please try again or call us directly.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ message: 'Message sent successfully!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### Resend SDK — Basic Usage

```typescript
// Source: https://github.com/resend/resend-node (v6.9.2)
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx'); // use import.meta.env.RESEND_API_KEY

const { data, error } = await resend.emails.send({
  from: 'Your Name <sender@yourdomain.com>',
  to: ['recipient@example.com'],
  replyTo: 'user@example.com',
  subject: 'Hello World',
  html: '<strong>it works!</strong>',
  text: 'it works!',
});

if (error) {
  console.error(error);
}
// data.id = email ID from Resend
```

### Environment Variable Setup

```bash
# .env (not committed to git)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
OWNER_EMAIL=owner@timberandthreadsretreat.com
```

```typescript
// In server endpoint only — never in client-side code
// import.meta.env works in Astro server endpoints
const resend = new Resend(import.meta.env.RESEND_API_KEY);
```

### Contact Info Display with Heroicons (inline SVG pattern)

```html
<!-- Source: Consistent with existing Workshops.astro / Accommodations.astro pattern -->
<!-- Phone: click-to-call on mobile -->
<a href="tel:+1XXXXXXXXXX" class="flex items-center gap-3 text-stone-700 hover:text-brand transition-colors">
  <!-- Heroicons phone solid -->
  <svg class="w-5 h-5 text-brand flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 8.25V4.5z" clip-rule="evenodd" />
  </svg>
  <span>(XXX) XXX-XXXX</span>
</a>

<!-- Email -->
<a href="mailto:info@timberandthreadsretreat.com" class="flex items-center gap-3 text-stone-700 hover:text-brand transition-colors">
  <!-- Heroicons envelope solid -->
  <svg class="w-5 h-5 text-brand flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
  </svg>
  <span>info@timberandthreadsretreat.com</span>
</a>

<!-- Address with get directions link -->
<div class="flex items-start gap-3 text-stone-700">
  <!-- Heroicons map-pin solid -->
  <svg class="w-5 h-5 text-brand flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.327a8 8 0 10-16 0c0 3.63 1.556 6.324 3.5 8.327a19.58 19.58 0 002.683 2.282 16.975 16.975 0 001.144.742zM11.5 13.5a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
  </svg>
  <span>
    306 NW 300 Rd, Clinton, MO 64735
    <br>
    <a href="#location" class="text-brand hover:underline text-sm">Get directions</a>
  </span>
</div>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `output: 'hybrid'` in Astro config | `output: 'static'` + `export const prerender = false` per endpoint | Astro 5.0 (Nov 2024) | The CONTEXT.md decision to switch to 'hybrid' is incorrect — keep 'static' |
| `import vercel from '@astrojs/vercel/serverless'` | `import vercel from '@astrojs/vercel'` | @astrojs/vercel v7+ | Already correct in project's astro.config.mjs |
| Nodemailer for serverless email | Resend SDK | 2023+ | Nodemailer SMTP doesn't work reliably on Vercel; Resend uses HTTP API |
| `process.env.VAR` in Astro endpoints | `import.meta.env.VAR` | Astro 1.0+ | `process.env` works in astro.config.mjs but not in server endpoint files |

**Deprecated/outdated:**
- `output: 'hybrid'`: Removed in Astro 5. The migration guide says to remove it — `output: 'static'` is the replacement.
- `@astrojs/vercel/serverless` import path: Deprecated but still works in v9; the unified `@astrojs/vercel` import is current and already used in this project.

---

## Open Questions

1. **Resend from-domain and owner email address**
   - What we know: Resend requires a verified sending domain; the `from` address must use that domain; the `to` (owner) address can be any email
   - What's unclear: The actual phone number, email address, and physical address to display in the contact info panel
   - Recommendation: Planner should note these are placeholder values to be confirmed with the client before launch. The API endpoint should use `OWNER_EMAIL` env var so it's configurable without code changes.

2. **Reply-to address in owner emails**
   - What we know: Setting `replyTo: visitorEmail` in the Resend call means the owner can hit Reply in their email client to respond directly to the visitor
   - What's unclear: Whether the owner wants replies routed differently (e.g., support email vs. personal)
   - Recommendation: Use `replyTo: email` (the visitor's email) — this is the standard contact form pattern. Document in `.env.example`.

3. **Resend domain verification status**
   - What we know: Domain must be verified before production emails work; free plan allows 1 domain
   - What's unclear: Whether `timberandthreadsretreat.com` DNS is accessible to the client for adding SPF/DKIM records
   - Recommendation: Planner should include a verification task in the deployment plan. For local dev, use `delivered@resend.dev` as the `to` address (Resend's test sink).

---

## Sources

### Primary (HIGH confidence)
- https://docs.astro.build/en/guides/upgrade-to/v5/ — Confirmed `output: 'hybrid'` removed in Astro 5; `output: 'static'` is the replacement
- https://docs.astro.build/en/guides/endpoints/ — Server endpoint POST pattern; `APIRoute` type; `request.json()`; `new Response()`
- https://docs.astro.build/en/guides/on-demand-rendering/ — `export const prerender = false` syntax; Astro 5 output modes
- https://docs.astro.build/en/guides/environment-variables/ — `import.meta.env` for server-side env vars; `PUBLIC_` prefix rules
- https://github.com/resend/resend-node — Resend Node.js SDK v6.9.2; `{ data, error }` return; installation; TypeScript support
- https://resend.com/docs/api-reference/emails/send-email — Required params: `from`, `to`, `subject`, `html`/`text`; `replyTo` support
- https://vercel.com/docs/frameworks/frontend/astro — Confirmed `output: 'hybrid'` + `@astrojs/vercel/serverless` for hybrid mode; existing project already uses updated import

### Secondary (MEDIUM confidence)
- https://docs.astro.build/en/guides/integrations-guide/vercel/ — `@astrojs/vercel` unified import path; adapter configuration
- https://resend.com/docs/dashboard/domains/introduction — Domain verification required; SPF + DKIM records needed; free tier = 1 domain
- https://resend.com/docs/knowledge-base/account-quotas-and-limits — Free tier: 3,000 emails/month, 100/day, 2 req/sec rate limit
- https://formshield.dev/blog/form-honeypot-implementation-guide — Off-screen CSS positioning for honeypot; avoid `display: none` for sophisticated bots
- https://blog.logrocket.com/ux-design/ux-form-validation-inline-after-submission/ — On-blur validation preferred for simple short forms; instant validation causes errors for hunt-and-peck typists
- https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/ — Inline validation tradeoffs; hybrid on-blur + on-submit recommended

### Tertiary (LOW confidence)
- None — all key claims verified with official sources.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Verified via official Astro docs, Resend GitHub repo, Vercel docs
- Architecture: HIGH — `output: 'static'` + `prerender = false` confirmed by Astro 5 upgrade guide
- Pitfalls: HIGH — `output: 'hybrid'` removal verified from multiple sources; env var rules from official Astro docs
- UX discretion choices: MEDIUM — Derived from UX research consensus (Smashing Magazine, LogRocket) rather than A/B testing with this specific audience

**Research date:** 2026-02-17
**Valid until:** 2026-03-19 (30 days — Astro and Resend are relatively stable; check if Astro 5.x minor changes `prerender` behavior)
