import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MetricMeshProvider, MetricMeshValue } from './MetricMeshValues';

const setTargets = vi.fn();
const dispose = vi.fn();

vi.mock('@/lib/metric-mesh-renderer', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/metric-mesh-renderer')>();
  return {
    ...original,
    createMetricMeshRenderer: () => ({ setTargets, resize: vi.fn(), dispose }),
  };
});

describe('metric mesh values', () => {
  it('shares one source while preserving accessible value text', () => {
    const { container, unmount } = render(
      <MetricMeshProvider>
        {['95%', '5%', '35', '96%'].map((value, index) => (
          <MetricMeshValue key={value} id={`metric-${index}`} value={value} index={index} />
        ))}
      </MetricMeshProvider>,
    );
    expect(container.querySelectorAll('[data-metric-mesh-source]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-metric-mesh]')).toHaveLength(4);
    for (const value of ['95%', '5%', '35', '96%']) expect(screen.getByText(value)).toBeInTheDocument();
    expect(setTargets).toHaveBeenLastCalledWith(expect.arrayContaining([
      expect.objectContaining({ value: '95%', index: 0 }),
      expect.objectContaining({ value: '96%', index: 3 }),
    ]));
    unmount();
    expect(dispose).toHaveBeenCalledOnce();
  });
});
