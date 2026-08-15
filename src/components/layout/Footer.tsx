'use client';

import { useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { gsap, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Logo } from '@/components/ui/Logo';
import { FadeUp } from '@/components/ui/SplitText';
import { usePathname } from 'next/navigation';
import { company, contact, navLinks, resolveNavHref, services, socials } from '@/lib/site';

/**
 * Footer.
 *
 * Kept quieter than the sections above it — after eight chapters of motion the
 * page should come to rest, not offer one last flourish. But "quieter" isn't
 * "static": the three link columns and the legal row still arrive with a soft
 * staggered rise on scroll, so the footer doesn't just snap into existence the
 * way it did before. The brand column (logo + newsletter) already had its own
 * `FadeUp`; this adds the same courtesy to everything beside it.
 */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [subscribed, setSubscribed] = useState(false);
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();

  useGSAP(
    () => {
      const columns = gsap.utils.toArray<HTMLElement>('[data-footer-col]');
      if (!columns.length) return;

      if (reducedMotion) {
        gsap.set(columns, { autoAlpha: 1, y: 0 });
        gsap.set('[data-footer-legal]', { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(columns, { autoAlpha: 0, y: 24 });
      gsap.set('[data-footer-legal]', { autoAlpha: 0, y: 12 });

      gsap.to(columns, {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        ease: EASE.glide,
        stagger: 0.09,
        scrollTrigger: { trigger: footerRef.current, start: 'top 85%', once: true },
      });

      gsap.to('[data-footer-legal]', {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: EASE.glide,
        delay: 0.2,
        scrollTrigger: { trigger: footerRef.current, start: 'top 85%', once: true },
      });
    },
    { scope: footerRef, dependencies: [reducedMotion] },
  );

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: wire to your ESP (Mailchimp, Resend, Customer.io…). The route
    // handler at /api/contact is a working reference for the fetch shape.
    setSubscribed(true);
    formRef.current?.reset();
  }

  const year = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className="relative border-t border-hairline bg-surface/45 backdrop-blur-xl"
    >
      <div className="mx-auto w-full max-w-[88rem] px-6 py-16 sm:px-8 lg:px-14 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Brand + newsletter */}
          <div className="lg:col-span-5">
            <FadeUp>
              <a href="#hero" className="group inline-flex" aria-label="heiller — back to top">
                <Logo />
              </a>

              <p className="mt-6 max-w-[42ch] text-[0.9375rem] leading-relaxed text-muted">
                {company.description}
              </p>

              <form ref={formRef} onSubmit={handleSubscribe} className="mt-9 max-w-md">
                <label
                  htmlFor="newsletter-email"
                  className="block text-eyebrow font-medium uppercase text-faint"
                >
                  The quarterly denial report
                </label>
                <div className="mt-3 flex gap-2">
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@practice.com"
                    className="min-w-0 flex-1 rounded-pill border border-hairline bg-surface px-5 py-3 text-[0.9375rem] text-navy outline-none transition-all duration-500 placeholder:text-faint focus:border-cobalt/45 focus:shadow-[0_0_0_4px_rgba(47,107,255,0.12)]"
                  />
                  <button
                    type="submit"
                    className="group inline-flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-inverse text-on-inverse transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-cobalt hover:text-frost hover:shadow-[0_10px_28px_-10px_rgba(47,107,255,0.7)]"
                    aria-label="Subscribe to the quarterly denial report"
                  >
                    {subscribed ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
                <p role="status" aria-live="polite" className="mt-3 text-[0.8125rem] text-positive">
                  {subscribed ? 'Subscribed. Look out for the next issue.' : ''}
                </p>
              </form>
            </FadeUp>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            <div data-footer-col>
              <h2 className="text-eyebrow font-medium uppercase text-faint">Explore</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={resolveNavHref(link.href, pathname)}
                      className="link-underline text-[0.9375rem] text-navy/75 transition-colors duration-300 hover:text-navy"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={resolveNavHref('#contact', pathname)}
                    className="link-underline text-[0.9375rem] text-navy/75 transition-colors duration-300 hover:text-navy"
                  >
                    Free audit
                  </a>
                </li>
              </ul>
            </div>

            <div data-footer-col>
              <h2 className="text-eyebrow font-medium uppercase text-faint">Services</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {services.slice(0, 6).map((service) => (
                  <li key={service.id}>
                    <a
                      href={resolveNavHref('#services', pathname)}
                      className="link-underline text-[0.9375rem] text-navy/75 transition-colors duration-300 hover:text-navy"
                    >
                      {service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div data-footer-col>
              <h2 className="text-eyebrow font-medium uppercase text-faint">Contact</h2>
              <ul className="mt-5 flex flex-col gap-3 text-[0.9375rem] text-navy/75">
                <li>
                  <a href={contact.emailHref} className="link-underline break-all hover:text-navy">
                    {contact.email}
                  </a>
                </li>
                <li>
                  <address className="not-italic leading-relaxed">
                    {contact.address.display}
                  </address>
                </li>
              </ul>

              {/* heiller has no public social accounts yet, so `socials` is an
                  empty array and this whole heading+list is skipped rather than
                  rendered as a "Follow" section with nothing under it. */}
              {socials.length > 0 && (
                <>
                  <h2 className="mt-8 text-eyebrow font-medium uppercase text-faint">
                    Follow
                  </h2>
                  <ul className="mt-5 flex flex-col gap-3">
                    {socials.map((social) => (
                      <li key={social.label}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-underline text-[0.9375rem] text-navy/75 transition-colors duration-300 hover:text-navy"
                        >
                          {social.label}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </nav>
        </div>

        <hr className="rule-fade mt-16" />

        <div
          data-footer-legal
          className="mt-8 flex flex-col gap-4 text-[0.8125rem] text-faint sm:flex-row sm:items-center sm:justify-between"
        >
          <p>
            © {year} {company.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-6">
            <li>
              <a href="#" className="link-underline hover:text-navy">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="link-underline hover:text-navy">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="link-underline hover:text-navy">
                HIPAA notice
              </a>
            </li>
            <li>
              <a href="#" className="link-underline hover:text-navy">
                Accessibility
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
