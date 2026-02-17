import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

// Simple HTML escaping to prevent injection in email body
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export const POST: APIRoute = async ({ request }) => {
  // 1. Parse request body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ message: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2. Honeypot check -- bots fill hidden fields, humans never see them
  // Return fake 200 so bots think it worked (don't send any email)
  if (body.website) {
    return new Response(
      JSON.stringify({ message: 'Message sent successfully!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 3. Server-side validation
  const errors: string[] = [];

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!name) {
    errors.push('Please enter your name');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }

  if (!message) {
    errors.push('Please enter a message');
  }

  if (errors.length > 0) {
    return new Response(
      JSON.stringify({ message: errors.join('. ') }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 4. Send email via Resend
  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #0D9488; border-bottom: 2px solid #0D9488; padding-bottom: 8px;">
        New Inquiry from ${safeName}
      </h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Message:</strong></p>
      <div style="background: #f9f9f9; padding: 16px; border-left: 4px solid #0D9488; border-radius: 4px; margin-top: 8px;">
        ${safeMessage}
      </div>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e5e5;" />
      <p style="color: #888; font-size: 12px;">
        This message was sent via the contact form at timberandthreadsretreat.com.
        Reply directly to this email to respond to ${safeName}.
      </p>
    </div>
  `;

  const textBody = `New inquiry from ${name}\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent via timberandthreadsretreat.com contact form.`;

  const { error } = await resend.emails.send({
    from: 'Timber & Threads Contact <noreply@timberandthreadsretreat.com>',
    to: [import.meta.env.OWNER_EMAIL],
    replyTo: email,
    subject: `New inquiry from ${name}`,
    html: htmlBody,
    text: textBody,
  });

  if (error) {
    console.error('Resend error:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to send your message. Please try again or call us directly.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 5. Success
  return new Response(
    JSON.stringify({ message: 'Message sent successfully!' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
