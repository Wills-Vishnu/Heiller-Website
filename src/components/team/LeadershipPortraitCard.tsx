import Image from 'next/image';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { Person } from '@/lib/team-content';
import type { SlotRole } from '@/lib/leadership-carousel';
import { LinkedInIcon, XIcon } from './TeamIcons';
import styles from './team.module.css';

/**
 * One portrait in the leadership strip.
 *
 * Both presentations — the active portrait and the inactive gray card —
 * are always in the DOM, stacked on top of each other, and crossfade via
 * opacity/transform driven purely by `data-role`. That's deliberate: if the
 * two states were two different subtrees swapped by a condition, React
 * would unmount one and mount the other every time `role` changes, and a
 * freshly-mounted node can't transition from "how it used to look" — the
 * brief's "no abrupt DOM replacement" requirement is really a requirement
 * that this component never do that swap.
 *
 * The wrapper is a plain `<div>` for the same reason, in every role: the
 * active layer holds real `<a>` LinkedIn/X links, and `<a>` inside
 * `<button>` is invalid HTML — so this can never be a `<button>` for the
 * active role. Making it *always* a button-less div (rather than a button
 * for some roles and a div for others) keeps one stable element identity
 * across the transition. The next/next2 cards get equivalent keyboard and
 * screen-reader semantics by hand (`role="button"`, `tabIndex`, Enter/Space).
 *
 * INACTIVE IMAGE: Every card renders the portrait image in both layers —
 * in the active frame at full quality, and in the inactive card at low
 * opacity with a grayscale filter. Because the image element is always
 * mounted (never replaced on state change), there is no loading delay when
 * a person becomes active. The inactive image uses `priority={false}` so
 * only the active card blocks the initial render.
 */
export function LeadershipPortraitCard({
  person,
  role,
  onSelect,
}: {
  person: Person;
  role: SlotRole;
  onSelect: () => void;
}) {
  const isActive = role === 'active';
  const isHidden = role === 'hidden';
  const isInteractive = role === 'next' || role === 'next2';

  const image = person.photo ?? person.img;
  const hasLinkedIn = Boolean(person.linkedin) && person.linkedin !== '#';
  const hasX = Boolean(person.x);
  const hasSocial = hasLinkedIn || hasX;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!isInteractive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  }

  // A click on a social link must not also count as "select this card" —
  // it already does its own thing (open LinkedIn/X in a new tab).
  function stopSocialClick(event: MouseEvent) {
    event.stopPropagation();
  }

  return (
    <div
      className={styles.leadershipCard}
      data-role={role}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : -1}
      aria-hidden={isHidden || undefined}
      aria-current={isActive ? 'true' : undefined}
      aria-label={isInteractive ? `Show ${person.name}` : undefined}
      onClick={isInteractive ? onSelect : undefined}
      onKeyDown={handleKeyDown}
    >
      {/* Active presentation: full portrait, bottom fade, name/role and
          social links burned into the image itself. */}
      <span className={styles.leadershipCardFrame} aria-hidden={isActive ? undefined : true}>
        {image ? (
          <Image
            className={styles.leadershipCardImage}
            src={image}
            alt={`${person.name}, ${person.role}`}
            fill
            draggable={false}
            sizes="(max-width: 640px) 60vw, (max-width: 1024px) 26vw, 480px"
            priority={isActive}
          />
        ) : null}
        <span className={styles.leadershipCardFade} />
        <span className={styles.leadershipCardInfo}>
          <span className={styles.leadershipCardName}>{person.name}</span>
          <span className={styles.leadershipCardRole}>{person.role}</span>
        </span>
        {hasSocial ? (
          <span className={styles.leadershipCardSocial}>
            {hasLinkedIn ? (
              <a
                className={styles.leadershipSocialButton}
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${person.name} on LinkedIn`}
                tabIndex={isActive ? 0 : -1}
                onClick={stopSocialClick}
              >
                <LinkedInIcon />
              </a>
            ) : null}
            {hasX ? (
              <a
                className={styles.leadershipSocialButton}
                href={person.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${person.name} on X`}
                tabIndex={isActive ? 0 : -1}
                onClick={stopSocialClick}
              >
                <XIcon />
              </a>
            ) : null}
          </span>
        ) : null}
      </span>

      {/* Inactive presentation: a quiet gray card with a faded grayscale
          portrait plus name and role. The image is always mounted so there
          is no loading delay when this person transitions to active — the
          browser already has the decoded pixel data. Opacity and filter
          transition away as the active frame fades in above. */}
      <span className={styles.leadershipCardInactive} aria-hidden={isActive || undefined}>
        {image ? (
          <Image
            className={styles.leadershipCardInactiveImage}
            src={image}
            alt=""
            fill
            draggable={false}
            sizes="(max-width: 640px) 60vw, (max-width: 1024px) 26vw, 480px"
            priority={false}
            aria-hidden
          />
        ) : null}
        {/* Soft gray wash over the faded portrait to unify the inactive tone */}
        <span className={styles.leadershipCardInactiveWash} aria-hidden="true" />
        <span className={styles.leadershipCardInactiveName}>{person.name}</span>
        <span className={styles.leadershipCardInactiveRole}>{person.role}</span>
      </span>
    </div>
  );
}
