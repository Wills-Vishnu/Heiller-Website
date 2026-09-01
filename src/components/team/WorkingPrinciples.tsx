import { workingPrinciples } from '@/lib/team-content';
import { PrincipleIcon } from './TeamIcons';
import { Eyebrow } from './SectionIntro';
import styles from './team.module.css';

const HEADING_LINES = ['Collaboration.', 'Ownership.', 'Focus.'] as const;

/**
 * Four principles in a divided row, with the stacked heading occupying the
 * first column. The dividers are `border-left` on each principle, so the
 * heading column is separated by the first one and no trailing rule appears.
 */
export function WorkingPrinciples() {
  return (
    <section className={styles.principles} aria-labelledby="principles-title">
      <div className={styles.shell}>
        <div className={styles.principlesInner}>
          <Eyebrow>How we work together</Eyebrow>

          <div className={styles.principlesGrid}>
            <h2 id="principles-title" className={styles.principlesHeading} data-anim="principles-heading">
              {HEADING_LINES.map((line) => <span key={line}>{line}</span>)}
            </h2>

            {workingPrinciples.map((principle) => (
              <article key={principle.id} className={styles.principle} data-anim="principle">
                <span className={styles.principleIcon}><PrincipleIcon name={principle.icon} /></span>
                <h3 className={styles.principleTitle}>{principle.title}</h3>
                <p className={styles.principleBody}>{principle.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
