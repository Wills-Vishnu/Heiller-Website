import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HeroFlow } from './HeroFlow';

describe('HeroFlow', () => {
  it('renders the full decorative revenue-cycle route', () => {
    const { container } = render(<HeroFlow />);
    const root = container.querySelector('[data-hero-flow]');
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root?.querySelectorAll('[data-flow-node]')).toHaveLength(8);
    expect(root?.querySelectorAll('[data-flow-track]')).toHaveLength(7);
    expect(root?.querySelectorAll('[data-flow-travel]')).toHaveLength(7);
  });
});
