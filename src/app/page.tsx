import { Hero } from '@/components/sections/Hero';
import { Problem } from '@/components/sections/Problem';
import { Complexity } from '@/components/sections/Complexity';
import { Services } from '@/components/sections/Services';
import { Analytics } from '@/components/sections/Analytics';
import { Trust } from '@/components/sections/Trust';
import { ContactCta } from '@/components/sections/ContactCta';

/**
 * The scroll narrative.
 *
 *   00  Hero        the promise            full-bleed video
 *   01  Problem     the leak               editorial stat band
 *   02  Complexity  why it happens         zig-zag centre spine
 *   03  Services    capabilities           bento grid
 *   04  Analytics   the standard           instrument panel (industry
 *                                          benchmarks, not heiller's own
 *                                          claimed results — see
 *                                          `sections/Analytics.tsx`)
 *   05  Trust       why trust a small,     three tilt cards + compliance
 *                   new company            badges (no client-logo marquee —
 *                                          see `sections/Trust.tsx`)
 *   06  Contact     the close              split form panel
 *
 * Workflow, Security and DashboardScene ("Explore") were removed from this
 * page on request — the eyebrow numbering above was closed up so the
 * remaining chapters read as an unbroken sequence rather than skipping from
 * 03 to 06. Their component files are untouched and still type-check; see
 * "Casualties of this rule" in the README for the full orphaned-file list.
 * `/security` is unaffected — it is a separate route, not this section.
 *
 * No two sections share a layout — see the inventory table in the README.
 * Every section carries its own GSAP/ScrollTrigger timeline; there is no
 * animated background layer behind them.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Complexity />
      <Services />
      <Analytics />
      <Trust />
      <ContactCta />
    </>
  );
}
