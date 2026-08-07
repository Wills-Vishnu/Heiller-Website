/**
 * Tailwind CSS v4 is consumed as a PostCSS plugin. All theme configuration
 * (colors, fonts, easing, shadows, breakpoints) lives in `src/app/globals.css`
 * under the `@theme` directive — there is intentionally no `tailwind.config.ts`.
 */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
