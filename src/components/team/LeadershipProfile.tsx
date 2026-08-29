'use client';

import { useEffect, useState } from 'react';
import type { Person } from '@/lib/team-content';
import styles from './team.module.css';

/** How long the outgoing content fades+lifts before the new content swaps in. */
const OUT_MS = 190;

/**
 * The one fixed content area described in the brief: name, role, and the
 * long description live here and change together when the active
 * principal changes — there is exactly one of these on the page, never one
 * per person. (LinkedIn/X now live inside the active portrait itself, so
 * this block is just identity + copy.)
 *
 * It's a two-column grid (name/role, then the paragraph) rather than a
 * single narrow column, specifically so the description gets real width to
 * breathe in — see `.leadershipProfile` in the stylesheet for why the
 * previous single-track layout squeezed it down to almost nothing.
 *
 * The crossfade is a small local state machine rather than a mount/unmount
 * per person (which would need a whole animation library to get an exit
 * transition out of): `shown` is the person currently painted, `phase`
 * tracks whether it's mid-swap. Because `data-phase="out"` and the idle
 * state share one `transition` declaration in CSS, flipping the attribute
 * (out → idle) at the same moment the content swaps is what makes the new
 * content fade *in* — see the class for the actual rule.
 */
export function LeadershipProfile({ person }: { person: Person }) {
  const [shown, setShown] = useState(person);
  const [phase, setPhase] = useState<'idle' | 'out'>('idle');

  useEffect(() => {
    if (person.id === shown.id) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setShown(person);
      return;
    }

    setPhase('out');
    const id = window.setTimeout(() => {
      setShown(person);
      setPhase('idle');
    }, OUT_MS);
    return () => window.clearTimeout(id);
  }, [person, shown]);

  return (
    <div className={styles.leadershipProfile} data-phase={phase === 'out' ? 'out' : undefined}>
      <div className={styles.leadershipProfileIdentity}>
        <h3 className={styles.leadershipName}>{shown.name}</h3>
        <p className={styles.leadershipRole}>{shown.role}</p>
      </div>

      <div className={styles.leadershipDescriptionBox}>
        <p className={styles.leadershipDescription}>{shown.description}</p>
      </div>
    </div>
  );
}
