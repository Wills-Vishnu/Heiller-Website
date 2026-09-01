import styles from './team.module.css';

/** Uppercase orange eyebrow with the accent dot. */
export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`${styles.eyebrow} ${light ? styles.eyebrowLight : ''}`}>{children}</p>;
}

/**
 * The two-column head shared by the leadership and members sections:
 * eyebrow + title on the left, supporting copy on the right. `trailing` slots
 * an extra column in (the carousel arrows) without a second layout.
 */
export function SectionIntro({
  eyebrow,
  title,
  body,
  headingId,
  trailing,
}: {
  eyebrow: string;
  title: string;
  body: string;
  headingId: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className={trailing ? styles.membersHead : styles.sectionHead} data-anim="section-intro">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={headingId} className={styles.sectionTitle}>{title}</h2>
      </div>
      <p className={styles.sectionLede}>{body}</p>
      {trailing}
    </div>
  );
}
