import { Hero } from '@/components/sections/Hero';
import { Problem } from '@/components/sections/Problem';
import { Complexity } from '@/components/sections/Complexity';
import { Services } from '@/components/sections/Services';
import { Workflow } from '@/components/sections/Workflow';
import { Security } from '@/components/sections/Security';
import { Analytics } from '@/components/sections/Analytics';
import { DashboardScene } from '@/components/sections/DashboardScene';
import { Trust } from '@/components/sections/Trust';
import { ContactCta } from '@/components/sections/ContactCta';

/**
 * The scroll narrative.
 *
 *   00  Hero        the promise            full-bleed video
 *   01  Problem     the leak               editorial stat band
 *   02  Complexity  why it happens         zig-zag centre spine
 *   03  Services    automation             bento grid
 *   04  Workflow    the pipeline           sticky drawn spine
 *   05  Security    trust                  stepped diagonal columns
 *   06  Analytics   revenue optimisation   instrument panel
 *   06½ Explore     the object             interactive CSS-3D dashboard
 *   07  Trust       social proof           marquee + tilt cards
 *   08  Contact     the close              split form panel
 *
 * `DashboardScene` sits immediately after Analytics on purpose: Analytics
 * argues the numbers, and this lets the reader pick the same numbers up and
 * turn them over. Placed anywhere else it is a gadget; placed here it is the
 * paragraph after the claim.
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
      <Workflow />
      <Security />
      <Analytics />
      <DashboardScene />
      <Trust />
      <ContactCta />
    </>
  );
}
