import Image from 'next/image';
import type { Person } from '@/lib/team-content';
import styles from './team.module.css';

/**
 * A person's portrait, grayscale until the card is hovered.
 *
 * When `photo` is absent it renders a neutral head-and-shoulders placeholder at
 * exactly the same aspect ratio, so dropping real images in later cannot shift
 * the layout. `ratio` is the width/height of the crop.
 */
export function PersonPhoto({
  person,
  ratio,
  sizes,
  priority = false,
}: {
  person: Person;
  ratio: number;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className={styles.photo} style={{ '--photo-ratio': String(ratio) } as React.CSSProperties}>
      {person.photo ? (
        <Image
          className={styles.photoImg}
          src={person.photo}
          alt={`${person.name}, ${person.role}`}
          fill
          sizes={sizes}
          priority={priority}
        />
      ) : (
        <svg
          className={styles.photoPlaceholder}
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label={`Portrait of ${person.name} coming soon`}
        >
          <circle cx="200" cy="128" r="58" fill="rgba(8,8,8,.12)" />
          <path d="M92 300c0-60 48-104 108-104s108 44 108 104z" fill="rgba(8,8,8,.12)" />
        </svg>
      )}
    </div>
  );
}
