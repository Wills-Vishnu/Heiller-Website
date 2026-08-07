'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Check, Loader2, Mail, MapPin, Phone } from 'lucide-react';
import { gsap, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SplitText, FadeUp } from '@/components/ui/SplitText';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { contact } from '@/lib/site';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const FIELD_CLASSES =
  'w-full rounded-2xl border border-hairline bg-frost/60 px-5 py-3.5 text-[0.9375rem] text-navy placeholder:text-faint outline-none transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] focus:border-cobalt/45 focus:bg-surface focus:shadow-[0_0_0_4px_rgba(47,107,255,0.18)]';

/**
 * Chapter 08 — the close.
 *
 * The camera has pushed all the way into the core by this point and the FOV is
 * at its widest, so the 3D layer is abstract light rather than a legible
 * object. That is deliberate: at the moment of decision the reader should be
 * looking at the form, not the graphics.
 *
 * FORM DESIGN
 * - Six fields, one of which is optional. Every additional required field on a
 *   B2B lead form measurably reduces completion; this is close to the floor for
 *   qualifying a healthcare RCM enquiry.
 * - Honeypot (`company_website`) plus a client-side timing check catch the bulk
 *   of naive bot submissions without a CAPTCHA.
 * - Errors and success are announced via `role="status"` so the outcome reaches
 *   screen readers, which a purely visual state change would not.
 *
 * REVEAL. The panel used to arrive as one rigid block. It now runs as a short
 * timeline: the panel itself rises and clears first, then the six fields
 * settle in with their own light stagger, starting while the panel tween is
 * still finishing (`-=0.75`) rather than waiting for it — a field-by-field
 * arrival reads as a form being filled in, which is a nice echo of what the
 * reader is about to do.
 */
export function ContactCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mountedAt = useRef(Date.now());
  const reducedMotion = useReducedMotion();

  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  useGSAP(
    () => {
      if (reducedMotion || !glowRef.current) return;

      // The closing light bloom: expands as the section is reached, so the page
      // resolves into light rather than simply ending.
      gsap.fromTo(
        glowRef.current,
        { scale: 0.55, autoAlpha: 0 },
        {
          scale: 1.25,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 0.9,
          },
        },
      );

      const panelTl = gsap.timeline({
        scrollTrigger: { trigger: '[data-contact-panel]', start: 'top 82%', once: true },
      });

      panelTl.from('[data-contact-panel]', {
        y: 60,
        autoAlpha: 0,
        filter: 'blur(12px)',
        duration: 1.2,
        ease: EASE.cinema,
      });

      panelTl.from(
        '[data-contact-field]',
        {
          y: 18,
          autoAlpha: 0,
          duration: 0.7,
          ease: EASE.glide,
          stagger: 0.08,
        },
        '-=0.75',
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // A human cannot meaningfully complete this form in under three seconds.
    if (Date.now() - mountedAt.current < 3000) {
      setStatus('error');
      setMessage('Please take a moment to review your details, then try again.');
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? 'Submission failed');
      }

      setStatus('success');
      setMessage(
        'Thank you — your audit request is in. We will reply within one business day.',
      );
      form.reset();
    } catch {
      setStatus('error');
      setMessage(
        `Something went wrong on our side. Please email us directly at ${contact.email}.`,
      );
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="relative scroll-mt-24 py-[16vh] lg:py-[22vh]"
    >
      {/* Closing bloom */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(47,107,255,0.20) 0%, rgba(107,152,255,0.10) 44%, rgba(107,152,255,0) 70%)',
        }}
      />

      <div className="mx-auto w-full max-w-[88rem] px-6 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-4xl text-center">
          <FadeUp>
            <span className="inline-flex items-center gap-2.5 text-eyebrow font-medium uppercase text-cobalt">
              <span aria-hidden="true" className="h-px w-8 bg-cobalt/45" />
              08 — Start here
              <span aria-hidden="true" className="h-px w-8 bg-cobalt/45" />
            </span>
          </FadeUp>

          <SplitText
            as="h2"
            text="Find out what your cycle is *actually* leaving behind."
            className="mt-8 text-display font-semibold text-navy"
            stagger={0.05}
          />
          <span id="contact-heading" className="sr-only">
            Request a free revenue audit
          </span>

          <FadeUp delay={0.12}>
            <p className="mx-auto mt-5 max-w-[54ch] text-lead text-muted">
              A free revenue audit. We review 90 days of claims, quantify the leakage by
              root cause, and hand you the findings — whether or not you work with us.
            </p>
          </FadeUp>
        </div>

        {/* ---- Panel ---------------------------------------------------------- */}
        <div
          data-contact-panel
          className="surface-card mx-auto mt-14 grid max-w-6xl overflow-hidden rounded-panel shadow-lift lg:mt-20 lg:grid-cols-12"
        >
          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="p-8 sm:p-10 lg:p-12" noValidate={false}>
              {/* Honeypot — visually and programmatically hidden from humans. */}
              <div className="absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
                <label htmlFor="company_website">Company website</label>
                <input
                  id="company_website"
                  name="company_website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div data-contact-field>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-navy">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Dr. Anita Raghavan"
                    className={FIELD_CLASSES}
                  />
                </div>

                <div data-contact-field>
                  <label
                    htmlFor="organisation"
                    className="mb-2 block text-sm font-medium text-navy"
                  >
                    Organisation
                  </label>
                  <input
                    id="organisation"
                    name="organisation"
                    type="text"
                    required
                    autoComplete="organization"
                    placeholder="Meridian Clinics"
                    className={FIELD_CLASSES}
                  />
                </div>

                <div data-contact-field>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-navy">
                    Work email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@practice.com"
                    className={FIELD_CLASSES}
                  />
                </div>

                <div data-contact-field>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-navy">
                    Phone <span className="font-normal text-faint">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+91 00000 00000"
                    className={FIELD_CLASSES}
                  />
                </div>

                <div data-contact-field className="sm:col-span-2">
                  <label
                    htmlFor="providers"
                    className="mb-2 block text-sm font-medium text-navy"
                  >
                    Number of providers
                  </label>
                  <select id="providers" name="providers" required className={FIELD_CLASSES}>
                    <option value="">Select a range</option>
                    <option value="1-5">1–5</option>
                    <option value="6-20">6–20</option>
                    <option value="21-75">21–75</option>
                    <option value="76-250">76–250</option>
                    <option value="250+">250+</option>
                  </select>
                </div>

                <div data-contact-field className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-navy"
                  >
                    What is hurting most right now?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Denials, A/R ageing, credentialing backlog…"
                    className={`${FIELD_CLASSES} resize-y`}
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <MagneticButton
                  type="submit"
                  variant="primary"
                  withArrow={status === 'idle' || status === 'error'}
                  disabled={status === 'submitting' || status === 'success'}
                >
                  {status === 'submitting' && (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  )}
                  {status === 'success' && <Check className="h-4 w-4" aria-hidden="true" />}
                  {status === 'submitting'
                    ? 'Sending…'
                    : status === 'success'
                      ? 'Request received'
                      : 'Get a free revenue audit'}
                </MagneticButton>

                <p className="max-w-[28ch] text-[0.8125rem] leading-relaxed text-faint">
                  No PHI in this form, please. We reply within one business day.
                </p>
              </div>

              {/* Live region — the only thing that announces the outcome. */}
              <p
                role="status"
                aria-live="polite"
                className={[
                  'mt-5 text-sm',
                  status === 'error' ? 'text-negative' : 'text-positive',
                  message ? '' : 'sr-only',
                ].join(' ')}
              >
                {message}
              </p>
            </form>
          </div>

          {/* Direct contact rail */}
          <div className="border-t border-hairline bg-navy/[0.03] p-8 sm:p-10 lg:col-span-5 lg:border-l lg:border-t-0 lg:p-12">
            <h3 className="text-title text-navy">Or reach us directly</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
              If it is easier to talk it through, we are happy to. No deck, no discovery
              call script.
            </p>

            <ul className="mt-9 flex flex-col gap-6">
              <li>
                <a
                  href={contact.phoneHref}
                  className="group flex items-start gap-4 outline-none"
                >
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cobalt/10 text-cobalt transition-colors duration-500 group-hover:bg-cobalt group-hover:text-frost">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-eyebrow font-medium uppercase text-faint">
                      Phone
                    </span>
                    <span className="link-underline mt-1 block font-display text-[1.0625rem] font-medium text-navy">
                      {contact.phoneDisplay}
                    </span>
                  </span>
                </a>
              </li>

              <li>
                <a
                  href={contact.emailHref}
                  className="group flex items-start gap-4 outline-none"
                >
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cobalt/10 text-cobalt transition-colors duration-500 group-hover:bg-cobalt group-hover:text-frost">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-eyebrow font-medium uppercase text-faint">
                      Email
                    </span>
                    <span className="link-underline mt-1 block break-all font-display text-[1.0625rem] font-medium text-navy">
                      {contact.email}
                    </span>
                  </span>
                </a>
              </li>

              <li className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cobalt/10 text-cobalt">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-eyebrow font-medium uppercase text-faint">
                    Office
                  </span>
                  <address className="mt-1 not-italic font-display text-[1.0625rem] font-medium leading-snug text-navy">
                    {contact.address.display}
                  </address>
                </span>
              </li>
            </ul>

            <p className="mt-9 border-t border-hairline pt-6 text-[0.8125rem] text-faint">
              {contact.hours}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
