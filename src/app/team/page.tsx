import type { Metadata } from 'next';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { TeamHero } from '@/components/team/TeamHero';
import { LeadershipSection } from '@/components/team/LeadershipSection';
import { TeamFooter } from '@/components/team/TeamFooter';
import { TeamMotion } from '@/components/team/TeamMotion';
import styles from '@/components/team/team.module.css';

export const metadata: Metadata = {
  title: 'Our team | Heiller',
  description:
    'The coders, billers, analysts and problem-solvers behind every claim. Meet the Heiller revenue-cycle team.',
};

export default function TeamPage() {
  return (
    <>
      {/* Renders nothing; owns every scroll/entrance animation on the page so
          the section components below can stay server components. */}
      <TeamMotion />
      <main id="main" className={styles.page}>
        <TeamHero />
        <LeadershipSection />
        <TeamFooter />
      </main>
      {/* Fixed to the viewport, not the page — sits outside <main> so it
          overlays content as it scrolls underneath, same wiring as the
          homepage's HomeExperience. */}
      <div className={styles.viewportBlur} aria-hidden="true">
        <ProgressiveBlur position="bottom" height="100%" />
      </div>
    </>
  );
}
