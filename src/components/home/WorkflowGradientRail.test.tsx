import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WorkflowGradientRail } from './WorkflowGradientRail';

vi.mock('@/lib/workflow-gradient-renderer', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/workflow-gradient-renderer')>();
  return { ...original, createWorkflowGradientRenderer: () => null };
});

describe('WorkflowGradientRail', () => {
  it('renders six semantic cards with decorative canvases and no wireframe body', () => {
    const { container } = render(<WorkflowGradientRail />);
    expect(container.querySelectorAll('[data-workflow-card]')).toHaveLength(6);
    expect(container.querySelectorAll('[data-workflow-gradient-canvas]')).toHaveLength(6);
    expect(container.querySelectorAll('[data-workflow-wireframe]')).toHaveLength(0);
    expect(screen.getByRole('heading', { name: 'Intake and registration' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Revenue reporting' })).toBeInTheDocument();
  });
});
