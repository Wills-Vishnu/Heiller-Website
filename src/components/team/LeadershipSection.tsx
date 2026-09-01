import { leadershipIntro } from '@/lib/team-content';
import { SectionIntro } from './SectionIntro';
import { LeadershipShowcase } from './LeadershipShowcase';
import styles from './team.module.css';

/**
 * The principals showcase: the same eyebrow/title/lede head used by the
 * team-members section below it, sitting above a single interactive
 * carousel that drives the section at every viewport width — see
 * `LeadershipShowcase` for the drag/selector/description machinery. There
 * is no separate mobile layout to keep in sync; only sizes change at
 * narrower breakpoints (in team.module.css), not structure.
 */
export function LeadershipSection() {
  return (
    <section className={styles.section} aria-labelledby="leadership-title">
      <div className={styles.shell}>
        <SectionIntro
          eyebrow={leadershipIntro.eyebrow}
          title={leadershipIntro.title}
          body={leadershipIntro.body}
          headingId="leadership-title"
        />
        <LeadershipShowcase />
      </div>
    </section>
  );
}
