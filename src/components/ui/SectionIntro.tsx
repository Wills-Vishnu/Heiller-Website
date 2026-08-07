import type { ReactNode } from 'react';
import { SplitText, FadeUp } from './SplitText';

interface SectionIntroProps {
  /** Small mono-tracked label, e.g. "02 — Complexity". */
  eyebrow: string;
  /** Headline. `*word*` renders in the editorial serif italic accent face. */
  title: string;
  /** Optional supporting paragraph. */
  lede?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  /** Rendered heading level. Only one `h1` exists on the page (the hero). */
  as?: 'h2' | 'h3';
}

/**
 * Shared chapter opening. Consistency here is what keeps nine very different
 * sections reading as one continuous document rather than nine templates.
 */
export function SectionIntro({
  eyebrow,
  title,
  lede,
  align = 'left',
  className = '',
  as = 'h2',
}: SectionIntroProps) {
  const centred = align === 'center';

  return (
    <div
      className={[
        'relative z-10 flex flex-col',
        centred ? 'items-center text-center' : 'items-start',
        className,
      ].join(' ')}
    >
      <FadeUp>
        <span
          className={[
            'inline-flex items-center gap-2.5 text-eyebrow font-medium uppercase text-cobalt',
            centred ? 'justify-center' : '',
          ].join(' ')}
        >
          <span aria-hidden="true" className="h-px w-8 bg-cobalt/45" />
          {eyebrow}
        </span>
      </FadeUp>

      <SplitText
        as={as}
        text={title}
        className={[
          // Was mt-6 (24px). A heading this large (up to ~4.25rem/68px) reads
          // as loosely related to its own lede at that gap — tightened to
          // sit closer, the way a headline and its dek actually pair in print.
          'mt-4 max-w-[19ch] text-headline text-navy',
          centred ? 'mx-auto max-w-[22ch]' : '',
        ].join(' ')}
        stagger={0.045}
      />

      {lede && (
        <FadeUp delay={0.12} className={centred ? 'mx-auto' : ''}>
          <p
            className={[
              // Was mt-7 (28px), same reasoning as above — mt-4 (16px) keeps
              // the lede visually attached to its headline instead of reading
              // as a separate block.
              'mt-4 max-w-[56ch] text-lead text-muted',
              centred ? 'mx-auto' : '',
            ].join(' ')}
          >
            {lede}
          </p>
        </FadeUp>
      )}
    </div>
  );
}
