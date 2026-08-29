import { teamStats } from '@/lib/team-content';
import { StatIcon } from './TeamIcons';
import styles from './team.module.css';

/**
 * The 2x2 stat panel that sits opposite the hero headline. Dividers come from
 * nth-child rules rather than per-cell borders so the outer edges never double
 * up against the card border.
 */
export function TeamStatsCard() {
  return (
    <dl className={styles.statsCard} data-anim="stats-card">
      {teamStats.map((stat) => (
        <div key={stat.id} className={styles.stat} data-anim="stat">
          <span className={styles.statIcon}><StatIcon name={stat.icon} /></span>
          <div>
            <dt className={styles.statValue} data-numeric={/\d/.test(stat.value) || undefined}>{stat.value}</dt>
            <dd className={styles.statLabel}>{stat.label}</dd>
            <dd className={styles.statBody}>{stat.body}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
