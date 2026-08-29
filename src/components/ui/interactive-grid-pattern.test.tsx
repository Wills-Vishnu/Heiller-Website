import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InteractiveGridPattern } from './interactive-grid-pattern';

describe('InteractiveGridPattern', () => {
  it('renders the configured decorative grid and responds to pointer hover', () => {
    const { container } = render(
      <InteractiveGridPattern width={20} height={24} squares={[3, 2]} />,
    );
    const grid = container.querySelector('[data-interactive-grid]')!;
    const squares = grid.querySelectorAll('rect');

    expect(grid).toHaveAttribute('aria-hidden', 'true');
    expect(grid).toHaveAttribute('focusable', 'false');
    expect(grid).toHaveAttribute('width', '60');
    expect(grid).toHaveAttribute('height', '48');
    expect(squares).toHaveLength(6);

    fireEvent.mouseEnter(squares[2]);
    expect(squares[2]).toHaveAttribute('data-hovered', 'true');
    fireEvent.mouseLeave(squares[2]);
    expect(squares[2]).not.toHaveAttribute('data-hovered');
  });
});
