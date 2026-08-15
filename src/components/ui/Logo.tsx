/**
 * heiller mark + wordmark.
 *
 * THE MARK — "the closing cycle"
 * A heavy blue arc that stops short of a full circle, with a warm terminal
 * sweeping into the gap. The open ring is the revenue cycle as it usually
 * runs — leaking at the handoff — and the warm stroke is the part heiller
 * closes. Inside sits the crossbar of a lowercase `e`.
 *
 * Built as inline SVG rather than an <img> so it inherits `currentColor`,
 * stays crisp at any size, animates on hover, and costs no request.
 *
 * ⚠️  REPLACE ME when the final brand asset is supplied. Drop the artwork into
 *     `/public/logo.svg` and swap the <svg> body below — every consumer imports
 *     this component, so nothing else needs to change.
 */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="heiller-mark"
          x1="6"
          y1="6"
          x2="34"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          {/* Theme-aware: the mark brightens with the rest of the palette in
              dark mode rather than sitting dim against a dark bar. */}
          <stop style={{ stopColor: 'var(--color-cobalt)' }} />
          <stop offset="1" style={{ stopColor: 'var(--color-cobalt-700)' }} />
        </linearGradient>
      </defs>

      {/* Open cycle — ~300° of arc, gap at the upper right. */}
      <path
        d="M27.5 8.6A14 14 0 1 0 33.4 24"
        stroke="url(#heiller-mark)"
        strokeWidth="4.6"
        strokeLinecap="round"
      />

      {/* The closing stroke: the intervention. */}
      <path
        d="M27.5 8.6 33.9 12"
        className="stroke-coral"
        strokeWidth="4.6"
        strokeLinecap="round"
      />

      {/* Counter-form: the crossbar of a lowercase e. */}
      <path
        d="M13.6 21.2h12"
        stroke="url(#heiller-mark)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * @param showSubtitle  Renders the "Revenue Cycle Management" descriptor under
 *                      the wordmark. On in the navbar (where it does real work
 *                      explaining an unfamiliar brand name), off in the footer
 *                      and mobile sheet where space is tighter and the context
 *                      is already established.
 */
export function Logo({
  className = '',
  showWordmark = true,
  showSubtitle = false,
}: {
  className?: string;
  showWordmark?: boolean;
  showSubtitle?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-9 w-9 shrink-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[18deg]" />

      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.4rem] font-semibold tracking-[-0.045em] text-navy">
            heiller
          </span>
          {showSubtitle && (
            <span className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.19em] text-faint">
              Revenue Cycle Management
            </span>
          )}
        </span>
      )}
    </span>
  );
}
