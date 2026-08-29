import { ArrowUpRight } from 'lucide-react';
import styles from './home.module.css';

/**
 * The one call-to-action on the page. Every section uses this so size and
 * treatment stay consistent; `header` is the only compact variant, since the
 * nav bar cannot carry the full-height split button.
 */
export function ArrowButton({
  label,
  href,
  dark = false,
  header = false,
}: {
  label: string;
  href: string;
  dark?: boolean;
  header?: boolean;
}) {
  return (
    <a
      className={`${styles.arrowButton} ${dark ? styles.arrowButtonDark : ''} ${header ? styles.headerCta : ''}`}
      href={href}
      data-header-cta={header || undefined}
    >
      <span>{label}</span>
      {header ? (
        <ArrowUpRight size={11} aria-hidden="true" />
      ) : (
        <span className={styles.arrowSquare} aria-hidden="true"><ArrowUpRight size={16} /></span>
      )}
    </a>
  );
}
