import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import styles from './hero-section.module.css';

/**
 * Reusable dark hero section with an interactive grid background and a bottom
 * gradient fade to white.
 *
 * Pass page-specific content (header, copy, illustrations) as `children`.
 * Add a `className` to set page-specific sizing (min-height, etc.).
 *
 * @example
 * ```tsx
 * import { HeroSection } from '@/components/site/HeroSection';
 * import pageStyles from './page.module.css';
 *
 * <HeroSection className={pageStyles.hero} aria-labelledby="hero-title">
 *   <h1 id="hero-title">Hello</h1>
 * </HeroSection>
 * ```
 */
export function HeroSection({
  children,
  className,
  fade = true,
  gridClassName,
  gridSquaresClassName,
  ...rest
}: React.ComponentPropsWithoutRef<'section'> & {
  fade?: boolean;
  gridClassName?: string;
  gridSquaresClassName?: string;
}) {
  return (
    <section
      className={`${styles.hero} ${className ?? ''}`}
      data-fade={fade ? undefined : 'off'}
      {...rest}
    >
      <InteractiveGridPattern
        className={`${styles.heroGrid} ${gridClassName ?? ''}`}
        squaresClassName={`${styles.heroGridSquare} ${gridSquaresClassName ?? ''}`}
        width={48}
        height={48}
        squares={[42, 24]}
      />
      {children}
    </section>
  );
}
