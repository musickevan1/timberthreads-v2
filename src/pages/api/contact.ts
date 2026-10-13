import type { APIRoute } from 'astro';
import { createContactHandler } from '../../lib/contact';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // Runtime values take precedence so secrets need not be copied into generated source.
  const handler = createContactHandler({ ...import.meta.env, ...process.env });
  return handler(request, clientAddress);
};
