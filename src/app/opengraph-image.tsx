import { ImageResponse } from 'next/og';
import { company } from '@/lib/site';

export const alt = `${company.name} — ${company.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export const runtime = 'edge';

/**
 * Generated social card.
 *
 * Uses system-stack fonts rather than fetching a webfont at render time: an
 * external font request inside `ImageResponse` is a network dependency on the
 * critical path of every unfurl, and a failed fetch produces a blank card. The
 * card is generated once and cached by the platform.
 *
 * Same generator serves Twitter via `twitter-image` re-export conventions —
 * Next.js falls back to the Open Graph image when no Twitter-specific one
 * exists.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background:
            'radial-gradient(120% 90% at 18% 0%, #ffffff 0%, #f2f5fc 42%, #e4ecf9 100%)',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          position: 'relative',
        }}
      >
        {/* Cobalt bloom */}
        <div
          style={{
            position: 'absolute',
            right: -180,
            top: -140,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background:
              'radial-gradient(circle, rgba(47,107,255,0.28) 0%, rgba(107,152,255,0.12) 42%, rgba(47,107,255,0) 68%)',
          }}
        />
        {/* Second blue bloom, lower and cooler — replaces the old coral heat
            now that warm accent is reserved for the logo terminal. */}
        <div
          style={{
            position: 'absolute',
            right: 60,
            bottom: -220,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background:
              'radial-gradient(circle, rgba(107,152,255,0.22) 0%, rgba(107,152,255,0) 68%)',
          }}
        />

        {/* Mark + wordmark. Path data mirrors `ui/Logo.tsx` — this route runs in
            the edge runtime and cannot import the component, so the two must be
            kept in sync by hand if the mark changes. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg width="52" height="52" viewBox="0 0 40 40" fill="none">
            <path
              d="M27.5 8.6A14 14 0 1 0 33.4 24"
              stroke="#2f6bff"
              strokeWidth="4.6"
              strokeLinecap="round"
            />
            <path d="M27.5 8.6 33.9 12" stroke="#ff7a3d" strokeWidth="4.6" strokeLinecap="round" />
            <path d="M13.6 21.2h12" stroke="#2f6bff" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 40, fontWeight: 700, color: '#111a35', letterSpacing: -1.6 }}>
            evadde
          </span>
        </div>

        {/* Headline — mirrors the hero's three lines, with the same blue
            third line, so a shared link previews as the page it opens. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -3.2,
              lineHeight: 1.08,
              maxWidth: 900,
            }}
          >
            <span style={{ color: '#111a35' }}>Recover More Revenue.</span>
            <span style={{ color: '#111a35' }}>Reduce Denials.</span>
            <span style={{ color: '#2f6bff' }}>Grow Faster.</span>
          </div>
          <span style={{ fontSize: 28, color: '#59657f', maxWidth: 820, lineHeight: 1.45 }}>
            Revenue cycle management for hospitals, clinics and physician groups.
          </span>
        </div>

        {/* Footer rail */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            fontSize: 22,
            color: '#8b97b1',
            letterSpacing: 1.6,
            textTransform: 'uppercase',
          }}
        >
          <span>HIPAA compliant</span>
          <span style={{ color: '#d5dff5' }}>·</span>
          <span>SOC 2 Type II</span>
          <span style={{ color: '#d5dff5' }}>·</span>
          <span>Denials · Coding · A/R</span>
        </div>
      </div>
    ),
    size,
  );
}
