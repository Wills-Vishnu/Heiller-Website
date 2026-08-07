'use client';

import { useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';

/**
 * Floating "back to top" control.
 *
 * Hidden until the reader has scrolled roughly one viewport, then fades and
 * lifts into view — driven by a single `ScrollTrigger.onToggle` flipping a
 * class, the same cheap technique `Navbar` uses for its condense state, so
 * this costs nothing per scroll frame.
 *
 * The click itself needs no handler: it's a plain `href="#hero"` anchor, and
 * `SmoothScrollProvider` already intercepts every `a[href^="#"]` click
 * site-wide to route it through Lenis and move keyboard focus to the target.
 * Reusing that mechanism means back-to-top behaves identically to every other
 * anchor link on the page instead of introducing a second, slightly different
 * scroll implementation.
 *
 * Always reachable by keyboard regardless of scroll position
 * (`focus-visible:opacity-100`), so tab order isn't punished for a decision
 * that's normally made with a mouse.
 */
export function BackToTop() {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    const button = buttonRef.current;
    if (!button) return;

    const trigger = ScrollTrigger.create({
      start: 'top -100%', // one viewport height of scroll
      end: 99999,
      onToggle: (self) => button.classList.toggle('is-visible', self.isActive),
    });

    return () => trigger.kill();
  }, []);

  return (
    <a
      ref={buttonRef}
      href="#hero"
      aria-label="Back to top"
      className={[
        'fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 scale-75 items-center justify-center',
        'rounded-full border border-hairline bg-surface/85 text-navy opacity-0 shadow-lift backdrop-blur-md',
        'pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'hover:-translate-y-1 hover:bg-surface hover:shadow-float',
        'focus-visible:pointer-events-auto focus-visible:scale-100 focus-visible:opacity-100',
        '[&.is-visible]:pointer-events-auto [&.is-visible]:scale-100 [&.is-visible]:opacity-100',
      ].join(' ')}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </a>
  );
}
