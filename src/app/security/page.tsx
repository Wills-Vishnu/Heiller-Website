import type { Metadata } from 'next';
import {
  AttestationGrid,
  ClosingBlock,
  ControlList,
  LifecycleBands,
  SecurityHero,
  SubprocessorTable,
} from '@/components/sections/SecurityMotion';
import { SITE_URL } from '@/lib/site';

/**
 * /security
 *
 * For the person doing vendor diligence — a compliance officer or security
 * lead, not the practice administrator the landing page addresses. They want
 * four things: where PHI lives, who else can reach it, what the notification
 * window is, and whether the certification language is honest.
 *
 * Read closely by one person doing a job, not skimmed. Everything here is
 * sized for that: full measure on the body text, generous section padding, no
 * layout that squeezes a paragraph below about 45 characters.
 *
 * See the header of `sections/SecurityMotion.tsx` for why the previous version
 * appeared to change theme halfway down the page.
 */

export const metadata: Metadata = {
  title: 'Security & compliance',
  description:
    'How evadde protects protected health information: attestations, the PHI lifecycle, control families, subprocessors and incident response.',
  alternates: { canonical: '/security' },
  openGraph: {
    title: 'Security & compliance — evadde',
    description:
      'Attestations, PHI lifecycle, control families, subprocessors and incident response.',
    url: `${SITE_URL}/security`,
  },
};

function Breadcrumbs() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Security', item: `${SITE_URL}/security` },
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

export default function SecurityPage() {
  return (
    <>
      <Breadcrumbs />
      <SecurityHero />

      {/* Attestations — roomy two-by-two */}
      <section className={`${WRAP} scroll-mt-24 py-[11vh]`}>
        <h2 className={`${H2} max-w-[20ch]`}>What we are actually audited against</h2>
        <p className="mt-5 max-w-[64ch] text-lead text-muted">
          Note the difference between <em>certified</em> and <em>aligned</em>. We keep
          them separate because conflating the two is the most common overclaim in
          healthcare vendor security, and you will find out either way during
          diligence.
        </p>
        <div className="mt-14">
          <AttestationGrid />
        </div>
      </section>

      {/* Lifecycle — full-width bands */}
      <section className={`${WRAP} scroll-mt-24 py-[11vh]`}>
        <h2 className={`${H2} max-w-[20ch]`}>Where your data actually goes</h2>
        <p className="mt-5 max-w-[64ch] text-lead text-muted">
          Not &ldquo;are you encrypted&rdquo; — everyone says yes — but where PHI
          physically lives, who can reach it, and when it is destroyed.
        </p>
        <div className="mt-14">
          <LifecycleBands />
        </div>
      </section>

      {/* Control families — definition list */}
      <section className={`${WRAP} scroll-mt-24 py-[11vh]`}>
        <h2 className={`${H2} max-w-[20ch]`}>The six control families</h2>
        <div className="mt-12">
          <ControlList />
        </div>
      </section>

      {/* Subprocessors — table */}
      <section className={`${WRAP} scroll-mt-24 py-[11vh]`}>
        <h2 className={`${H2} max-w-[20ch]`}>Who else can reach it</h2>
        <p className="mt-5 max-w-[64ch] text-lead text-muted">
          The full list. We give notice before adding to it, and you can object.
        </p>
        <div className="mt-12">
          <SubprocessorTable />
        </div>
      </section>

      {/* Closing */}
      <section className={`${WRAP} pb-[14vh] pt-[4vh]`}>
        <ClosingBlock />
      </section>
    </>
  );
}
