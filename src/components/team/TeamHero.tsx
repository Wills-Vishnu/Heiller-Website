import { HeroSection } from '@/components/site/HeroSection';
import { SiteHeader } from '@/components/site/SiteHeader';
import { teamHero, TEAM_NAV_ACTIVE } from '@/lib/team-content';
import { TeamStatsCard } from './TeamStatsCard';
import { Eyebrow } from './SectionIntro';
import styles from './team.module.css';

/**
 * Black hero band carrying the header. Unlike the homepage hero this one cuts
 * straight into white rather than fading — the design puts a hard edge under
 * the stat card. The grid itself is the same InteractiveGridPattern the
 * homepage hero uses, so the hover highlight matches across pages — it's a
 * shared primitive in components/ui, not something re-implemented per page.
 */
export function TeamHero() {
  return (
    <HeroSection
      className={styles.hero}
      gridClassName={styles.heroGrid}
      gridSquaresClassName={styles.heroGridSquare}
      aria-labelledby="team-hero-title"
    >
      <SiteHeader active={TEAM_NAV_ACTIVE} />

      <div className={styles.shell}>
        <div className={styles.heroInner}>
          <div data-anim="hero-copy">
            <Eyebrow light>{teamHero.eyebrow}</Eyebrow>
            <h1 id="team-hero-title" className={styles.heroTitle}>{teamHero.title}</h1>
            <p className={styles.heroBody}>{teamHero.body}</p>
          </div>
          <TeamStatsCard />
        </div>
      </div>
    </HeroSection>
  );
}
