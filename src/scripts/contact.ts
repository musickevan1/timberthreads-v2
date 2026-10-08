import { INQUIRY_ID } from '../lib/contact-id';

const form = document.getElementById('contact-form') as HTMLFormElement;
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
const btnText = document.getElementById('btn-text') as HTMLSpanElement;
const btnSpinner = document.getElementById('btn-spinner') as HTMLSpanElement;
const successMsg = document.getElementById('success-message') as HTMLDivElement;
const successText = document.getElementById('success-text') as HTMLParagraphElement;
const errorMsg = document.getElementById('error-message') as HTMLDivElement;
const nameInput = document.getElementById('name') as HTMLInputElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const messageInput = document.getElementById('message') as HTMLTextAreaElement;
const nameError = document.getElementById('name-error') as HTMLSpanElement;
const emailError = document.getElementById('email-error') as HTMLSpanElement;
const messageError = document.getElementById('message-error') as HTMLSpanElement;
const emailRegex = /^[^\s@<>"(),;:\\]+@[^\s@<>"(),;:\\]+\.[^\s@<>"(),;:\\]+$/;
let submitting = false;
let pending: { id: string; payload: string; createdAt: number } | null = null;
const draftKey = 'timberthreads:contact-draft:v1';

function validate(input: HTMLInputElement | HTMLTextAreaElement, error: HTMLElement, valid: boolean): boolean {
  error.classList.toggle('hidden', valid);
  input.setAttribute('aria-invalid', String(!valid));
  return valid;
}
function validateName(): boolean { return validate(nameInput, nameError, !!nameInput.value.trim() && nameInput.value.length <= 100); }
function validateEmail(): boolean { return validate(emailInput, emailError, emailInput.value.length <= 254 && emailRegex.test(emailInput.value.trim())); }
function validateMessage(): boolean { return validate(messageInput, messageError, !!messageInput.value.trim() && messageInput.value.length <= 5000); }
nameInput?.addEventListener('blur', validateName);
emailInput?.addEventListener('blur', validateEmail);
messageInput?.addEventListener('blur', validateMessage);

// Session-only recovery: keep the token and submitted draft together after an uncertain response.
try {
  const saved = JSON.parse(sessionStorage.getItem(draftKey) || 'null');
  if (saved && typeof saved.id === 'string' && INQUIRY_ID.test(saved.id) && typeof saved.payload === 'string' && typeof saved.createdAt === 'number') {
    const values = JSON.parse(saved.payload);
    if (typeof values.name === 'string' && typeof values.email === 'string' && typeof values.message === 'string') {
      pending = saved;
      nameInput.value = values.name;
      emailInput.value = values.email;
      messageInput.value = values.message;
    }
  }
} catch { /* Storage can be unavailable in private browsing; in-page retries still reuse the token. */ }

  function buildPrefilledMessage(detail: {
    groupSize: number;
    nights: number;
    includeMeals: boolean;
    total: number;
    perPerson: number;
    isFlatRate: boolean;
  }): string {
    const { groupSize, nights, includeMeals, total, perPerson, isFlatRate } = detail;
    const lines: string[] = [];
    lines.push(`Group Size: ${groupSize} guest${groupSize !== 1 ? 's' : ''}`);
    lines.push(`Nights: ${nights}`);
    if (includeMeals) {
      lines.push('Meals: Included');
    }
    if (isFlatRate) {
      lines.push('Pricing: Flat rate for 10-12 guests');
    }
    lines.push(`Estimated Total: $${total.toLocaleString()} ($${perPerson.toLocaleString()}/person)`);
    lines.push('');
    lines.push('Please add your preferred dates or any questions below:');
    lines.push('');
    return lines.join('\n');
  }

  let lastPrefilledMessage = '';

  window.addEventListener('calculator:quote-requested', (e: Event) => {
    const evt = e as CustomEvent<{
      groupSize: number;
      nights: number;
      includeMeals: boolean;
      total: number;
      perPerson: number;
      isFlatRate: boolean;
    }>;

    const contactSection = document.getElementById('contact');
    const newMessage = buildPrefilledMessage(evt.detail);

    // Pre-fill logic with draft protection (PRIC-10)
    if (form && !form.classList.contains('hidden')) {
      const currentValue = messageInput.value.trim();
      if (currentValue === '' || currentValue === lastPrefilledMessage.trim()) {
        // Empty or unchanged previous pre-fill — safe to update
        messageInput.value = newMessage;
        lastPrefilledMessage = newMessage;

        // Highlight flash on textarea
        messageInput.classList.remove('quote-highlight');
        // Force reflow to allow re-triggering animation on repeat clicks
        void messageInput.offsetWidth;
        messageInput.classList.add('quote-highlight');
        messageInput.addEventListener('animationend', () => {
          messageInput.classList.remove('quote-highlight');
        }, { once: true });
      }
      // If visitor has edited the pre-fill, skip overwrite — respect their draft
    }

    // Smooth scroll to message textarea so pre-filled content is visible
    messageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Focus name field after scroll completes (~600ms for smooth scroll)
    if (form && !form.classList.contains('hidden')) {
      setTimeout(() => {
        nameInput?.focus();
      }, 600);
    }
  });


form?.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting) return;
  const nameValid = validateName();
  const emailValid = validateEmail();
  const messageValid = validateMessage();
  if (!nameValid || !emailValid || !messageValid) {
    (!nameValid ? nameInput : !emailValid ? emailInput : messageInput).focus();
    return;
  }
  const payload = JSON.stringify({name: nameInput.value.trim(), email: emailInput.value.trim(), message: messageInput.value.trim()});
  if (!pending || pending.payload !== payload) pending = { id: crypto.randomUUID(), payload, createdAt: Date.now() };
  try { sessionStorage.setItem(draftKey, JSON.stringify(pending)); } catch { /* Best-effort browser recovery. */ }
  const body = { ...JSON.parse(payload), website: (form.elements.namedItem('website') as HTMLInputElement).value };
  submitting = true;
  form.setAttribute('aria-busy', 'true');
  errorMsg.classList.add('hidden');
  submitBtn.disabled = true;
  btnText.textContent = 'Sending...';
  btnSpinner.classList.remove('hidden');
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch('/api/contact', {
      method: 'POST', headers: {'Content-Type':'application/json', 'Idempotency-Key':pending.id, 'X-Contact-Created-At':String(pending.createdAt)},
      body:JSON.stringify(body), signal:controller.signal,
    });
    const data = await response.json().catch(() => null);
    if (response.ok && data?.accepted === true && data.reference === pending.id && typeof data.message === 'string') {
      successText.textContent = `${data.message} Reference: ${data.reference}`;
      form.classList.add('hidden');
      successMsg.classList.remove('hidden');
      successMsg.focus();
      pending = null;
      try { sessionStorage.removeItem(draftKey); } catch { /* No persistent browser draft needed. */ }
    } else {
      errorMsg.textContent = typeof data?.message === 'string' ? data.message : 'We could not confirm your inquiry was saved. Your draft is still here; please retry or contact us directly.';
      errorMsg.classList.remove('hidden');
      errorMsg.focus();
    }
  } catch {
    errorMsg.textContent = 'We could not confirm your inquiry was saved because the connection was interrupted. Your draft is still here; retrying it is safe, or call (417) 343-1473 or email timberandthreads24@gmail.com.';
    errorMsg.classList.remove('hidden');
    errorMsg.focus();
  } finally {
    clearTimeout(timeout);
    submitting = false;
    form.setAttribute('aria-busy', 'false');
    submitBtn.disabled = false;
    btnText.textContent = 'Send Message';
    btnSpinner.classList.add('hidden');
  }
});
// Keep no-JavaScript visits from navigating with personal fields in a query string.
if (form && submitBtn) submitBtn.disabled = false;
