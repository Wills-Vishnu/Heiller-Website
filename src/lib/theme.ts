/**
 * Theme plumbing.
 *
 * POLICY: light by default, toggle-only.
 * The OS `prefers-color-scheme` setting is deliberately *not* consulted. A
 * reader arriving for the first time always sees the light design; dark mode
 * is something they opt into, and that choice then persists. (If you ever want
 * to honour the system preference instead, the only change needed is in
 * `THEME_INIT_SCRIPT` below — everything else is already preference-agnostic.)
 *
 * MECHANISM: a single `dark` class on `<html>`.
 * Every colour in the design system is a CSS custom property, and the dark
 * palette is just those same properties redefined under `html.dark`. So one
 * class toggle re-colours the entire site — no React context threading colours
 * down the tree, no component needs to know the theme, and nothing re-renders
 * on switch. The only two consumers that read the theme in JS are the ones
 * painting to a `<canvas>`, which has no access to CSS cascade.
 */

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'heiller-theme';

/** Browser-chrome colour per theme, kept in sync with `--color-frost`. */
export const THEME_COLORS: Record<Theme, string> = {
  light: '#f2f5fc',
  dark: '#0a0f1e',
};

/**
 * Runs before first paint to prevent a flash of the wrong theme.
 *
 * This has to be a blocking inline script. If the class were applied in a
 * `useEffect`, a reader who had chosen dark would get a full white frame first
 * — the most visible possible bug, on every single page load. The cost is one
 * synchronous localStorage read, which is microseconds.
 *
 * Wrapped in try/catch because `localStorage` throws outright in Safari's
 * private mode and when third-party cookies are blocked in an iframe. Failing
 * there should silently fall back to light, not blank the page on a syntax
 * error at the top of the document.
 */
export const THEME_INIT_SCRIPT = `(function(){try{if(localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})();`;

/** Reads the theme currently applied to the document. */
export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * Applies a theme: flips the class, persists it, and updates the
 * `theme-color` meta so mobile browser chrome follows along.
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;

  document.documentElement.classList.toggle('dark', theme === 'dark');

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage unavailable — the theme still applies for this session.
  }

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLORS[theme]);
}
