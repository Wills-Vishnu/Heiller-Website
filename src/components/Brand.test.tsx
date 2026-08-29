import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Brand } from './Brand';

const V2_FLOWER_PATH = 'M9.5 36C9.5 41.247 5.248 45.5 0 45.5L0 36C0 30.752 4.254 26.5 9.5 26.5ZM19 26.5C24.248 26.5 28.5 30.752 28.5 36L28.5 45.5C23.254 45.5 19 41.247 19 36 19 41.247 14.748 45.5 9.5 45.5L9.5 36C9.5 30.752 13.754 26.5 19 26.5ZM28.5 26.5C33.748 26.5 38 30.752 38 36L38 45.5C32.754 45.5 28.5 41.247 28.5 36ZM0 7.5C5.248 7.5 9.5 11.752 9.5 17L9.5 26.5C4.254 26.5 0 22.247 0 17ZM28.5 17C28.5 22.247 24.248 26.5 19 26.5 13.754 26.5 9.5 22.247 9.5 17L9.5 7.5C14.748 7.5 19 11.752 19 17 19 11.752 23.254 7.5 28.5 7.5ZM38 17C38 22.247 33.748 26.5 28.5 26.5L28.5 17C28.5 11.752 32.754 7.5 38 7.5Z';

describe('Brand', () => {
  it('renders the exact V2 flower mark and Heiller wordmark', () => {
    const { container } = render(<Brand inverse />);
    expect(screen.getByText('Heiller')).toBeInTheDocument();
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 7.5 38 38');
    expect(container.querySelector('path')).toHaveAttribute('d', V2_FLOWER_PATH);
  });
});
