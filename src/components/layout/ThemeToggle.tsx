'use client';

import { useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import { applyTheme, getTheme } from '@/lib/theme';

/**
 * Light / dark switch.
 *
 * NO REACT STATE, ON PURPOSE.
 * The obvious implementation holds the theme in `useState` — and it has a
 * hydration bug that's easy to ship. The server has no idea what the reader
 * chose last visit, so it must render one fixed theme; the blocking init
 * script then flips the class before React hydrates. Any component whose
 * *markup* depends on the theme therefore renders a mismatch, and React
 * either warns or silently patches it up a frame later — a visible icon flip
 * on every load.
 *
 * Instead the two icons are both always in the DOM and swapped by the `dark:`
 * variant, i.e. by the same CSS cascade that themes everything else. The
 * server and client render byte-identical markup, so there is nothing to
 * mismatch, and the correct icon is showing before JavaScript has run at all.
 * The click handler reads the current theme from the DOM rather than from
 * state, which is the actual source of truth here.
 *
 * The label stays constant across both states ("Toggle dark mode") rather than
 * describing the destination ("Switch to dark"). A label that changes with
 * state would have the same server/client divergence problem, and this phrasing
 * is accurate either way.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const handleClick = useCallback(() => {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className={[
        'inline-flex h-11 w-11 items-center justify-center rounded-full',
        'border border-hairline bg-surface/70 text-navy',
        'transition-colors duration-300 hover:bg-surface hover:text-cobalt',
        className,
      ].join(' ')}
    >
      <Sun className="h-[1.15rem] w-[1.15rem] dark:hidden" aria-hidden="true" />
      <Moon className="hidden h-[1.15rem] w-[1.15rem] dark:block" aria-hidden="true" />
    </button>
  );
}
