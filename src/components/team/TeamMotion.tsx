'use client';

import { gsap, useGSAP } from '@/lib/gsap';

/**
 * All scroll and entrance motion for the /team page, in one place.
 *
 * Rendering this as a sibling of the page content (rather than wrapping it)
 * keeps every section component a server component — the animation layer is
 * the only thing shipped to the client. It finds its targets by `data-anim`
 * attribute, so a section can opt in by adding one attribute and needs no
 * import, no ref, and no "use client" of its own.
 *
 * Everything lives inside a `prefers-reduced-motion: no-preference` match, so
 * a user who asks for reduced motion gets the page with no transforms applied
 * at all — not a faster version of the same animation. `gsap.from` would
 * otherwise leave elements at opacity 0 if a trigger never fired, so each
 * scroll-driven tween uses `once: true` plus an explicit clearProps.
 */
export function TeamMotion() {
  // Deliberately NOT scoped to a ref: this component renders nothing, so a
  // scope element would contain none of the targets and every selector would
  // silently match zero nodes. Selectors resolve against the document, which
  // is correct here — one page, one instance.
  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const q = (selector: string) => gsap.utils.toArray<HTMLElement>(selector);

      /** Shared scroll-trigger config: fire once, a little before the top edge. */
      const onScroll = (trigger: Element | string, start = 'top 85%') => ({
        trigger,
        start,
        once: true,
      });

      // ---- hero: immediate, no scroll trigger (it is already in view) ----
      gsap.from('[data-anim="hero-copy"] > *', {
        y: 26,
        autoAlpha: 0,
        stagger: 0.09,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'all',
      });

      gsap.from('[data-anim="stats-card"]', {
        y: 34,
        autoAlpha: 0,
        duration: 0.9,
        delay: 0.15,
        ease: 'power3.out',
        clearProps: 'all',
      });

      gsap.from('[data-anim="stat"]', {
        autoAlpha: 0,
        y: 14,
        stagger: 0.07,
        duration: 0.6,
        delay: 0.35,
        ease: 'power2.out',
        clearProps: 'all',
      });

      // ---- working principles ----
      q('[data-anim="principles-heading"] span').forEach((line, index) => {
        gsap.from(line, {
          y: 22,
          autoAlpha: 0,
          duration: 0.7,
          delay: index * 0.08,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: onScroll(line.closest('[data-anim="principles-heading"]') ?? line),
        });
      });

      q('[data-anim="principle"]').forEach((card, index) => {
        gsap.from(card, {
          y: 30,
          autoAlpha: 0,
          duration: 0.7,
          delay: index * 0.08,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: onScroll(card),
        });
      });

      // ---- shared section heads ----
      q('[data-anim="section-intro"]').forEach((intro) => {
        gsap.from(intro.children, {
          y: 24,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: onScroll(intro),
        });
      });

      // ---- leadership showcase ----
      // A single fade+rise on the whole block, deliberately not staggering
      // into its children: the carousel drives its own transform on drag,
      // and a GSAP tween reaching into that same subtree on scroll-in would
      // be one more thing to keep from fighting the pointer handling.
      const leadershipShowcase = document.querySelector('[data-anim="leadership-showcase"]');
      if (leadershipShowcase) {
        gsap.from(leadershipShowcase, {
          y: 32,
          autoAlpha: 0,
          duration: 0.85,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: onScroll(leadershipShowcase, 'top 82%'),
        });
      }

      // ---- roster carousel ----
      const firstMember = document.querySelector('[data-anim="member-card"]');
      if (firstMember) {
        gsap.from('[data-anim="member-card"]', {
          y: 34,
          autoAlpha: 0,
          stagger: 0.07,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: onScroll(firstMember, 'top 88%'),
        });
      }

      // ---- footer ----
      // The footer is sticky and revealed from underneath, so it is already
      // on screen well before its own top edge crosses the trigger line.
      // Trigger on the last section instead and animate only the contents.
      const footer = document.querySelector('[data-anim="footer"]');
      if (footer) {
        gsap.from(footer.children, {
          y: 30,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: footer,
            start: 'top 95%',
            once: true,
          },
        });
      }
    });

    return () => media.revert();
  });

  return null;
}
