import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { BackToTop } from '@/components/layout/BackToTop';
import { THEME_COLORS, THEME_INIT_SCRIPT } from '@/lib/theme';
import { company, contact, services, socials, SITE_URL } from '@/lib/site';

/* -------------------------------------------------------------------------- */
/* Typography                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Two faces, each with one job:
 *   SORA   display + UI. Geometric, slightly technical, tightens well at
 *          large sizes without becoming generic.
 *   INTER  body. Nothing outperforms it for dense UI copy at 15–17px.
 *
 * A third face (Instrument Serif italic) previously set accent words inside
 * headlines. The approved design does that emphasis with colour instead, so
 * the family was dropped — one fewer font request on the critical path.
 *
 * `display: 'swap'` plus preload keeps the LCP text painting on the first frame
 * with a fallback, then swapping — a blocking font here would cost ~300ms of
 * LCP on the hero headline.
 */
const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sora',
  display: 'swap',
  preload: true,
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

/* -------------------------------------------------------------------------- */
/* Metadata                                                                    */
/* -------------------------------------------------------------------------- */

const title = `${company.name} — ${company.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s — ${company.name}`,
  },
  description: company.description,
  applicationName: company.name,
  keywords: [
    'revenue cycle management',
    'RCM services',
    'medical billing',
    'medical coding',
    'denial management',
    'A/R follow-up',
    'healthcare credentialing',
    'eligibility verification',
    'claims submission',
    'healthcare revenue analytics',
  ],
  authors: [{ name: company.name, url: SITE_URL }],
  creator: company.name,
  publisher: company.name,
  alternates: { canonical: '/' },
  category: 'Healthcare Technology',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: company.name,
    title,
    description: company.description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: company.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.svg' }],
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  /* A single value, not a media-query pair. The theme here is an explicit
     reader choice stored in localStorage, not a reflection of the OS setting,
     so `prefers-color-scheme` would routinely disagree with what is actually
     on screen. `applyTheme()` rewrites this meta tag on toggle instead. */
  themeColor: THEME_COLORS.light,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  // Never block zoom. Pinch-zoom is a primary accessibility affordance and
  // disabling it is a WCAG 1.4.4 failure.
  maximumScale: 5,
};

/* -------------------------------------------------------------------------- */
/* Structured data                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Two graph nodes: the organisation itself, and the service catalogue. Google
 * uses the former for knowledge-panel and sitelink eligibility, and the latter
 * to understand what is actually being offered — which for a single-page site
 * is otherwise very hard for a crawler to infer from a scroll narrative.
 */
function StructuredData() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'MedicalBusiness'],
        '@id': `${SITE_URL}/#organization`,
        name: company.name,
        legalName: company.legalName,
        url: SITE_URL,
        slogan: company.tagline,
        description: company.description,
        foundingDate: company.founded,
        email: contact.email,
        // No `telephone` field — heiller doesn't publish a phone number, and
        // schema.org doesn't require one. `sameAs` is omitted entirely rather
        // than emitted as an empty array: `socials` is empty until heiller
        // has real public social accounts to link.
        ...(socials.length > 0 && { sameAs: socials.map((social) => social.href) }),
        address: {
          '@type': 'PostalAddress',
          streetAddress: contact.address.street,
          addressLocality: contact.address.locality,
          addressRegion: contact.address.region,
          postalCode: contact.address.postalCode,
          addressCountry: contact.address.country,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: contact.email,
          availableLanguage: ['en'],
        },
      },
      {
        '@type': 'Service',
        '@id': `${SITE_URL}/#service`,
        serviceType: 'Revenue Cycle Management',
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: 'US',
        audience: {
          '@type': 'Audience',
          audienceType:
            'Hospitals, clinics, physicians, medical groups and healthcare networks',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Revenue Cycle Management services',
          itemListElement: services.map((service) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: service.title,
              description: service.summary,
            },
          })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: company.name,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Content is fully static and authored here — no user input reaches it.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Root layout                                                                 */
/* -------------------------------------------------------------------------- */

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="relative min-h-screen antialiased">
        {/* Must be the first thing in the document and must block. If the dark
            class were applied in an effect instead, a reader who chose dark
            would see a full white frame on every load. `suppressHydrationWarning`
            on <html> above is what lets this mutate className before React
            hydrates without a warning. */}
        <script
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />

        <StructuredData />

        {/* Fail-safe. Headlines and reveal blocks start hidden so GSAP can
            animate them in; if JavaScript never runs, this puts every one of
            them back. Without it a script failure would render the page blank
            of copy — the classic, and entirely avoidable, animation-first bug. */}
        <noscript>
          <style>{`
            .split-word > span { transform: none !important; }
            [style*="visibility: hidden"],
            [style*="visibility:hidden"] { visibility: visible !important; }
            [data-hero-item], [data-facet], [data-service-card],
            [data-pillar], [data-quote], [data-step],
            [data-layer], [data-tab], [data-stat], [data-check],
            [data-contact-field], [data-security-cta],
            [data-page-hero], [data-reveal],
            [data-tl-item], [data-tl-node], [data-sp-row],
            [data-tier], [data-tier-bar], [data-stat-cell],
            [data-stat-rule], [data-person], [data-story-p],
            [data-scramble-real], [data-stat-col],
            [data-hero-text],
            [data-sh], [data-sh-rule], [data-att],
            [data-band], [data-band-edge],
            [data-ctrl-row], [data-cb], [data-panel],
            [data-ah], [data-ah-rule], [data-sb], [data-pr], [data-pr-num],
            [data-es], [data-roster], [data-roster-rule],
            [data-ac], [data-ac-rule] {
              opacity: 1 !important;
              visibility: visible !important;
              transform: none !important;
              clip-path: none !important;
            }
          `}</style>
        </noscript>

        <a href="#main" className="skip-link surface-glass rounded-pill px-5 py-3 text-sm font-medium text-navy">
          Skip to content
        </a>

        <SmoothScrollProvider>
          {/* Flat frost background (see globals.css `body`) — no ambient light
              field, no WebGL scene. All motion on the page now comes from the
              GSAP/ScrollTrigger timelines inside the sections themselves
              (reveals, pinned sequences, the workflow spine, etc.), not from
              anything painted behind the content. The two exceptions are
              ScrollProgress and BackToTop below — small, persistent,
              page-wide controls rather than section content, so they live
              here in the shell instead of in `page.tsx`. */}
          <ScrollProgress />

          <Navbar />

          <main id="main" className="relative z-10">
            {children}
          </main>

          <div className="relative z-10">
            <Footer />
          </div>

          {/* Tab order deliberately puts this last: a keyboard reader who has
              tabbed all the way through the page is exactly who "jump back to
              the top" is for. It's independently reachable at any scroll
              position via :focus-visible (see BackToTop's own comment), so
              its position here doesn't gate when it can be found. */}
          <BackToTop />

          <div className="grain" aria-hidden="true" />
          <div className="vignette" aria-hidden="true" />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
