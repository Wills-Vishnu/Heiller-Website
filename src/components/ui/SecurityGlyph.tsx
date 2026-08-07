import type { securityPillars } from '@/lib/site';

/**
 * Six original geometric marks for the security control families.
 *
 * The brief was explicit about avoiding clichés, so there is no padlock, no
 * keyhole and no shield-with-a-tick anywhere. Each mark abstracts the
 * *mechanism* instead: encryption is legible data becoming an unreadable
 * cipher grid; audit trail is an append-only ledger of stepped rules; access
 * control is a set of concentric gates with exactly one aligned aperture.
 *
 * All six share a 64×64 viewBox and a 1.6 stroke so they sit on one optical
 * weight, and all animate on hover from a parent `.group`.
 *
 * Lives here rather than inside `sections/Security.tsx` because `/security`
 * needs the same six marks. It is pure markup with no hooks or handlers, so
 * it carries no `'use client'` directive and can render inside a server
 * component — which is what keeps the `/security` route shipping almost no
 * JavaScript for its content.
 */
type Glyph = (typeof securityPillars)[number]['glyph'];

export function SecurityGlyph({
  name,
  className = 'h-14 w-14 text-cobalt',
}: {
  name: Glyph;
  className?: string;
}) {
  const shared = {
    viewBox: '0 0 64 64',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
    // Spread onto every variant below so Security.tsx's scroll-entrance
    // animation can select all six without a switch of its own.
    'data-security-glyph': true,
  };

  switch (name) {
    /* Plaintext rows dissolving into cipher blocks, left to right. */
    case 'lock':
      return (
        <svg {...shared}>
          {[16, 26, 36, 46].map((y, row) => (
            <g key={y}>
              <path d={`M8 ${y}h${18 - row * 3}`} strokeOpacity={0.9} />
              {[0, 1, 2, 3].map((i) => (
                <rect
                  key={i}
                  x={30 + i * 7}
                  y={y - 3.2}
                  width="5"
                  height="6.4"
                  rx="1.2"
                  strokeOpacity={0.32 + i * 0.16}
                  className="origin-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-[-2px]"
                  style={{ transitionDelay: `${(row + i) * 32}ms` }}
                />
              ))}
            </g>
          ))}
        </svg>
      );

    /* Nested chevrons — layered policy, each enclosing the last. */
    case 'shield':
      return (
        <svg {...shared}>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M32 ${10 + i * 6} L${52 - i * 6} ${24 + i * 3} L32 ${52 - i * 4} L${12 + i * 6} ${24 + i * 3} Z`}
              strokeOpacity={1 - i * 0.28}
              className="origin-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              style={{ transitionDelay: `${i * 70}ms` }}
            />
          ))}
        </svg>
      );

    /* Append-only ledger: stepped rules, newest at the bottom, never rewritten. */
    case 'trail':
      return (
        <svg {...shared}>
          <path d="M10 54V10" strokeOpacity={0.35} />
          {[16, 24, 32, 40, 48].map((y, i) => (
            <g key={y}>
              <circle
                cx="10"
                cy={y}
                r="2.4"
                fill="currentColor"
                stroke="none"
                fillOpacity={0.35 + i * 0.14}
              />
              <path
                d={`M14 ${y}h${16 + i * 6}`}
                strokeOpacity={0.35 + i * 0.14}
                className="origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-110"
                style={{ transitionDelay: `${i * 55}ms` }}
              />
            </g>
          ))}
        </svg>
      );

    /* Isolated tenancy: stacked planes with one sealed boundary between them. */
    case 'cloud':
      return (
        <svg {...shared}>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M12 ${22 + i * 11} L32 ${13 + i * 11} L52 ${22 + i * 11} L32 ${31 + i * 11} Z`}
              strokeOpacity={1 - i * 0.26}
              className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[3px]"
              style={{ transitionDelay: `${(2 - i) * 70}ms` }}
            />
          ))}
          <path d="M32 31v11M32 42v11" strokeOpacity={0.3} strokeDasharray="2 3" />
        </svg>
      );

    /* Concentric gates with exactly one aligned aperture: least privilege. */
    case 'key':
      return (
        <svg {...shared}>
          {[22, 16, 10].map((r, i) => (
            <circle
              key={r}
              cx="32"
              cy="32"
              r={r}
              strokeOpacity={0.9 - i * 0.2}
              strokeDasharray={`${r * 4.6} ${r * 1.6}`}
              className="origin-center transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[26deg]"
              style={{ transitionDelay: `${i * 80}ms` }}
            />
          ))}
          <circle cx="32" cy="32" r="2.6" fill="currentColor" stroke="none" />
        </svg>
      );

    /* Continuity: a primary orbit and its geographically separated replica. */
    case 'orbit':
    default:
      return (
        <svg {...shared}>
          <ellipse
            cx="32"
            cy="32"
            rx="22"
            ry="10"
            className="origin-center transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[18deg]"
          />
          <ellipse
            cx="32"
            cy="32"
            rx="22"
            ry="10"
            transform="rotate(62 32 32)"
            strokeOpacity={0.55}
            className="origin-center transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-[14deg]"
          />
          <circle cx="32" cy="32" r="5" strokeOpacity={0.9} />
          <circle cx="52" cy="26" r="3" fill="currentColor" stroke="none" fillOpacity={0.75} />
        </svg>
      );
  }
}
