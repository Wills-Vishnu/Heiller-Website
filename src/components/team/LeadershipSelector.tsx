import { useRef, type CSSProperties, type KeyboardEvent } from 'react';
import type { Person } from '@/lib/team-content';
import { wrapIndex } from '@/lib/leadership-carousel';
import styles from './team.module.css';

/**
 * A vertical timeline: one continuous gray line, a circular node per
 * person, and a fit-width name pill per person.
 *
 * The gray line and every node/pill are static, always-gray elements —
 * the "active" look is a single gradient ring that floats on top of
 * whichever node is current, moved purely with `transform: translateY()`.
 * That's not a stylistic choice, it's a browser limitation working in our
 * favour: two different `background: linear-gradient(...)` values can't be
 * cross-faded by a CSS transition (gradients aren't interpolable), so the
 * only way to get a genuinely smooth, physically-moving gradient — rather
 * than a hard cut from one row's color to the next — is to keep it as one
 * element and move it, exactly like the ring. The pill's own color still
 * needs to change when it becomes active, so *that* crosses over with an
 * opacity fade on an internal gradient layer instead (opacity, unlike
 * gradient backgrounds, animates natively) — see `.leadershipTimelinePill`
 * and its `::before` in the stylesheet.
 *
 * Row height is fixed (`--row-h`) for the same reason the ring's transform
 * math needs it: `translateY(i * row-h)` only lines up with every row if
 * every row is the same height.
 */
export function LeadershipSelector({
  people,
  activeIndex,
  onSelect,
}: {
  people: readonly Person[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    const next = wrapIndex(activeIndex + (event.key === 'ArrowDown' ? 1 : -1), people.length);
    onSelect(next);
  }

  return (
    <div className={styles.leadershipTimelineWrap}>
      <span className={styles.leadershipTimelineLine} aria-hidden="true" />
      <span
        className={styles.leadershipTimelineRing}
        style={{ '--i': activeIndex } as CSSProperties}
        aria-hidden="true"
      />
      <ul
        className={styles.leadershipTimeline}
        aria-label="Choose a leader"
        onKeyDown={handleKeyDown}
      >
        {people.map((person, index) => {
          const active = index === activeIndex;
          return (
            <li key={person.id} className={styles.leadershipTimelineRow}>
              <span className={styles.leadershipTimelineNodeCol} aria-hidden="true">
                <span className={styles.leadershipTimelineNode} />
              </span>
              <button
                type="button"
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                className={styles.leadershipTimelinePill}
                data-active={active || undefined}
                aria-current={active ? 'true' : undefined}
                aria-label={`${person.name}, ${person.role}`}
                onClick={() => onSelect(index)}
              >
                <span className={styles.leadershipTimelinePillLabel}>{person.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
