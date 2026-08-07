import { NextResponse } from 'next/server';

/**
 * Contact / audit-request endpoint.
 *
 * Deliberately dependency-free so it runs anywhere without configuration. Wire
 * `CONTACT_WEBHOOK_URL` to your CRM, Zapier hook, Resend/SendGrid endpoint or
 * HubSpot form API; with it unset, submissions are logged server-side so the
 * form is still fully testable in development.
 *
 * ⚠️  PHI WARNING
 * This endpoint is NOT a HIPAA-compliant channel and the form copy tells users
 * not to submit PHI. If you ever intend to accept PHI here you must add a BAA
 * with your hosting and email providers, encrypt at rest, and add audit
 * logging. Do not skip that.
 *
 * Rate limiting is intentionally left to the edge (Vercel WAF, Cloudflare, an
 * API gateway). An in-process limiter is useless on a serverless platform where
 * every request may hit a cold instance.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ContactPayload {
  name?: unknown;
  organisation?: unknown;
  email?: unknown;
  phone?: unknown;
  providers?: unknown;
  message?: unknown;
  /** Honeypot. Any value at all means a bot filled it in. */
  company_website?: unknown;
}

const MAX_LENGTHS = {
  name: 120,
  organisation: 160,
  email: 254,
  phone: 40,
  providers: 20,
  message: 4000,
} as const;

/** Pragmatic email check. Full RFC 5322 validation is not worth the surface. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function asString(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request body.' }, { status: 400 });
  }

  // Honeypot: respond 200 so the bot believes it succeeded and does not retry.
  if (asString(payload.company_website, 200).length > 0) {
    return NextResponse.json({ ok: true });
  }

  const submission = {
    name: asString(payload.name, MAX_LENGTHS.name),
    organisation: asString(payload.organisation, MAX_LENGTHS.organisation),
    email: asString(payload.email, MAX_LENGTHS.email),
    phone: asString(payload.phone, MAX_LENGTHS.phone),
    providers: asString(payload.providers, MAX_LENGTHS.providers),
    message: asString(payload.message, MAX_LENGTHS.message),
  };

  const missing = (['name', 'organisation', 'email', 'providers', 'message'] as const).filter(
    (field) => submission[field].length === 0,
  );

  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, error: `Missing required field(s): ${missing.join(', ')}.` },
      { status: 400 },
    );
  }

  if (!EMAIL_PATTERN.test(submission.email)) {
    return NextResponse.json(
      { ok: false, error: 'Please provide a valid email address.' },
      { status: 400 },
    );
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;

  if (!webhook) {
    // Development / unconfigured path. Never log in production, where this
    // would write submitted contact details into your platform logs.
    if (process.env.NODE_ENV !== 'production') {
      console.info('[contact] submission received (no CONTACT_WEBHOOK_URL set)', submission);
    }
    return NextResponse.json({ ok: true });
  }

  try {
    const forwarded = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...submission,
        source: 'evadde.com — free revenue audit',
        receivedAt: new Date().toISOString(),
        notify: process.env.CONTACT_NOTIFY_EMAIL ?? null,
      }),
    });

    if (!forwarded.ok) throw new Error(`Webhook responded ${forwarded.status}`);
  } catch (error) {
    console.error('[contact] forwarding failed', error);
    return NextResponse.json(
      { ok: false, error: 'We could not deliver your message. Please email us directly.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
