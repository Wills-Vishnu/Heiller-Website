'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP, EASE } from '@/lib/gsap';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { cta, navLinks, resolveNavHref } from '@/lib/site';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Fixed navigation.
 *
 * Behaviour:
 * - Transparent over the hero, then condenses into a frosted bar once the
 *   reader has committed to scrolling. The transition is driven by a single
 *   ScrollTrigger toggling a class, not by a scroll listener setting state, so
 *   it costs nothing per frame.
 * - Hides on scroll down, reveals on scroll up. On a page this long, a
 *   permanently visible bar is 72px of viewport tax on every section.
 * - The mobile sheet traps focus, closes on Escape, closes on navigation, and
 *   locks body scroll while open.
 */
export function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();

  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header) return;

      /* ---- Condense ------------------------------------------------------- */
      ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        onToggle: (self) => header.classList.toggle('is-condensed', self.isActive),
      });

      if (reducedMotion) return;

      /* ---- Auto-hide ------------------------------------------------------ */
      let lastScroll = 0;
      const hide = gsap
        .to(header, { yPercent: -130, duration: 0.45, ease: EASE.swift, paused: true })
        .progress(0);

      ScrollTrigger.create({
        start: 'top top',
        end: 99999,
        onUpdate: (self) => {
          const current = self.scroll();
          // Ignore sub-8px jitter; trackpads generate a lot of it.
          if (Math.abs(current - lastScroll) < 8) return;

          const scrollingDown = current > lastScroll;
          lastScroll = current;

          if (scrollingDown && current > 320) hide.play();
          else hide.reverse();
        },
      });

      /* ---- Mount intro -----------------------------------------------------
         The bar itself was appearing instantly on load while everything below
         it (the hero) cascades in. A short, subtle drop-and-fade on the logo,
         links and CTA — timed just after the hero badge starts — ties the two
         together instead of the nav looking like a static template header. */
      gsap.from('[data-nav-item]', {
        autoAlpha: 0,
        y: -10,
        duration: 0.7,
        ease: EASE.glide,
        stagger: 0.06,
        delay: 0.2,
      });
    },
    { scope: headerRef, dependencies: [reducedMotion] },
  );

  /* ---- Mobile sheet: scroll lock, Escape, focus management ---------------- */
  useEffect(() => {
    if (!menuOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusables = sheetRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    sheetRef.current?.querySelector<HTMLElement>('a[href]')?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, [menuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 will-change-transform [&.is-condensed>div]:border-hairline [&.is-condensed>div]:bg-surface/72 [&.is-condensed>div]:shadow-rest [&.is-condensed>div]:backdrop-blur-xl"
      >
        {/* `relative` anchors the absolutely-centred nav below. Centring the
            links on the bar itself (rather than letting flex distribute them)
            is what keeps them from drifting as the logo and CTA change width. */}
        <div className="relative mx-auto flex max-w-[88rem] items-center justify-between gap-6 border-b border-transparent px-6 py-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-8 lg:px-14">
          <a
            href="#hero"
            data-nav-item
            className="group inline-flex items-center rounded-lg outline-none"
            aria-label="heiller — back to top"
          >
            <Logo showSubtitle />
          </a>

          <nav
            aria-label="Primary"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 lg:flex"
          >
            {navLinks.map((link) => {
              const href = resolveNavHref(link.href, pathname);
              const isCurrent = link.href === pathname;
              return (
                <a
                  key={link.href}
                  href={href}
                  data-nav-item
                  aria-current={isCurrent ? 'page' : undefined}
                  className={[
                    'link-underline text-[0.9375rem] font-medium transition-colors duration-300 hover:text-navy',
                    isCurrent ? 'text-navy' : 'text-navy/75',
                  ].join(' ')}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <span data-nav-item>
              <ThemeToggle />
            </span>

            <span data-nav-item className="hidden sm:inline-flex">
              <MagneticButton
                href={cta.primary.href}
                variant="primary"
                withArrow
                className="px-6! py-3! text-sm"
              >
                {cta.primary.label}
              </MagneticButton>
            </span>

            <button
              type="button"
              data-nav-item
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-surface/70 text-navy backdrop-blur-md transition-colors duration-300 hover:bg-surface lg:hidden"
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* ---- Mobile sheet ---------------------------------------------------- */}
      <div
        id="mobile-nav"
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={[
          'fixed inset-0 z-[70] lg:hidden',
          'transition-[opacity,visibility] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0',
        ].join(' ')}
      >
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 h-full w-full cursor-default bg-scrim backdrop-blur-sm"
        />

        <div
          className={[
            'absolute inset-x-0 top-0 rounded-b-panel border-b border-hairline bg-frost/95 px-6 pb-10 pt-5 shadow-float backdrop-blur-2xl',
            'transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            menuOpen ? 'translate-y-0' : '-translate-y-full',
          ].join(' ')}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-surface text-navy"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-9 flex flex-col">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={resolveNavHref(link.href, pathname)}
                onClick={() => setMenuOpen(false)}
                aria-current={link.href === pathname ? 'page' : undefined}
                className="border-b border-hairline py-4 font-display text-2xl font-semibold tracking-[-0.03em] text-navy transition-colors duration-300 hover:text-cobalt"
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-8">
            <MagneticButton
              href={cta.primary.href}
              variant="primary"
              withArrow
              className="w-full"
              onClick={() => setMenuOpen(false)}
            >
              {cta.primary.label}
            </MagneticButton>
          </div>
        </div>
      </div>
    </>
  );
}
