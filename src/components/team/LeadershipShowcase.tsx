'use client';

import { useState } from 'react';
import { leadership } from '@/lib/team-content';
import { wrapIndex } from '@/lib/leadership-carousel';
import { LeadershipSelector } from './LeadershipSelector';
import { LeadershipCarousel } from './LeadershipCarousel';
import { LeadershipProfile } from './LeadershipProfile';
import styles from './team.module.css';

/**
 * Owns the single piece of state the whole section hangs off:
 * `activeIndex`. The selector, the carousel and the profile block are all
 * pure functions of it (plus their own purely-visual/gesture-local state),
 * so a drag release, a selector click and a preview-card click all funnel
 * through the same `setActiveIndex` and can never disagree with each other.
 */
export function LeadershipShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  function goTo(index: number) {
    setActiveIndex(wrapIndex(index, leadership.length));
  }

  const active = leadership[activeIndex];

  return (
    <div className={styles.leadershipShowcase} data-anim="leadership-showcase">
      <LeadershipSelector people={leadership} activeIndex={activeIndex} onSelect={goTo} />
      <LeadershipCarousel people={leadership} activeIndex={activeIndex} onChangeIndex={goTo} />
      <LeadershipProfile person={active} />
    </div>
  );
}
