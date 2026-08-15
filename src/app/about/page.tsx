import type { Metadata } from 'next';
import {
  AboutClosing,
  AboutHero,
  EngagementStaircase,
  PrincipleList,
  StoryBlock,
  TeamGrid,
} from '@/components/sections/AboutMotion';
import { company, SITE_URL } from '@/lib/site';

/**
 * /about
 *
 * The landing page argues that revenue cycle failure is a *systems* problem.
 * This page makes that credible by saying who is making the argument and why
 * they would know — a different job from restating the pitch at length.
 *
 * Team first, then the argument. The roster used to close the page, after
 * three sections of philosophy; it now opens it, right after the hero — a
 * reader deciding whether to trust a small, new company should see who
 * they'd actually be working with before reading why to trust them, not
 * after. `TeamGrid` (formerly `RosterStrip`) also moved from a text strip to
 * photo cards for the same reason: eight named people read as a roster now,
 * not a footnote.
 *
 * Every layout is unique site-wide — inventory at the top of
 * `sections/SecurityMotion.tsx`.
 */

export const metadata: Metadata = {
  title: 'About us',
  description: `Who ${company.name} is, what we believe about revenue cycle failure, how an engagement runs, and where we operate.`,
  alternates: { canonical: '/about' },
  openGraph: {
    title: `About us — ${company.name}`,
    description:
      'Built by people who have worked the denial queue. Operating principles, engagement model and delivery footprint.',
    url: `${SITE_URL}/about`,
  },
};

function Breadcrumbs() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'About us', item: `${SITE_URL}/about` },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

const WRAP = 'mx-auto w-full max-w-[88rem] px-6 sm:px-8 lg:px-14';
const H2 = 'font-display text-headline font-semibold text-navy';

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs />
      <AboutHero />

      {/* Team — photo card grid, first section on the page */}
      <section className={`${WRAP} scroll-mt-24 py-[10vh]`}>
        <h2 className={`${H2} mb-12 max-w-[20ch]`}>Who you will be working with</h2>
        <TeamGrid />
      </section>

      {/* Story — asymmetric, with the figures set into its margin */}
      <section className={`${WRAP} scroll-mt-24 py-[10vh]`}>
        <h2 className={`${H2} max-w-[16ch]`}>Why we exist</h2>
        <div className="mt-12">
          <StoryBlock />
        </div>
      </section>

      {/* Principles — oversized numbered list */}
      <section className={`${WRAP} scroll-mt-24 py-[10vh]`}>
        <h2 className={`${H2} max-w-[16ch]`}>How we operate</h2>
        <p className="mt-4 max-w-[58ch] text-lead text-muted">
          Four commitments. Each one costs us something, which is the only reason
          any of them are worth stating.
        </p>
        <div className="mt-14">
          <PrincipleList />
        </div>
      </section>

      {/* Engagement — descending staircase */}
      <section className={`${WRAP} scroll-mt-24 py-[10vh]`}>
        <h2 className={`${H2} max-w-[20ch]`}>What working together looks like</h2>
        <p className="mt-4 max-w-[52ch] text-lead text-muted">
          No discovery-call script, no six-week onboarding that bills before it
          delivers.
        </p>
        <div className="mt-14">
          <EngagementStaircase />
        </div>
      </section>

      <section className={`${WRAP} py-[12vh]`}>
        <AboutClosing />
      </section>
    </>
  );
}
