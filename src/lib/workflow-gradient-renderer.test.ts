import { describe, expect, it } from 'vitest';
import {
  createWorkflowGradientRenderer,
  getAtlasCell,
  shouldAnimateWorkflowGradient,
  WORKFLOW_GRADIENT_SCENES,
  WORKFLOW_VISUAL_ORDER,
} from './workflow-gradient-renderer';

describe('workflow gradient configuration', () => {
  it('assigns one scene to every existing workflow identifier', () => {
    expect(WORKFLOW_VISUAL_ORDER).toEqual([
      'registration',
      'coding',
      'submission',
      'denial',
      'ar',
      'reporting',
    ]);
    expect(Object.keys(WORKFLOW_GRADIENT_SCENES).sort()).toEqual([...WORKFLOW_VISUAL_ORDER].sort());
  });

  it('uses four valid normalized RGB colors for every scene', () => {
    for (const scene of Object.values(WORKFLOW_GRADIENT_SCENES)) {
      expect(scene.colors).toHaveLength(4);
      for (const color of scene.colors) {
        expect(color).toHaveLength(3);
        expect(color.every((channel) => channel >= 0 && channel <= 1)).toBe(true);
      }
    }
  });

  it('maps six identifiers to unique cells in a 3 by 2 atlas', () => {
    const cells = WORKFLOW_VISUAL_ORDER.map((visual) => getAtlasCell(visual, 1920, 1080));
    expect(new Set(cells.map(({ x, y }) => `${x}:${y}`)).size).toBe(6);
    expect(cells.every(({ width, height }) => width === 640 && height === 540)).toBe(true);
    expect(cells).toEqual([
      { x: 0, y: 0, width: 640, height: 540 },
      { x: 640, y: 0, width: 640, height: 540 },
      { x: 1280, y: 0, width: 640, height: 540 },
      { x: 0, y: 540, width: 640, height: 540 },
      { x: 640, y: 540, width: 640, height: 540 },
      { x: 1280, y: 540, width: 640, height: 540 },
    ]);
  });
});

describe('workflow gradient animation policy', () => {
  it('animates only while active, visible, in view, and motion is allowed', () => {
    const active = { disposed: false, reducedMotion: false, documentVisible: true, inView: true };
    expect(shouldAnimateWorkflowGradient(active)).toBe(true);
    expect(shouldAnimateWorkflowGradient({ ...active, disposed: true })).toBe(false);
    expect(shouldAnimateWorkflowGradient({ ...active, reducedMotion: true })).toBe(false);
    expect(shouldAnimateWorkflowGradient({ ...active, documentVisible: false })).toBe(false);
    expect(shouldAnimateWorkflowGradient({ ...active, inView: false })).toBe(false);
  });
});

describe('createWorkflowGradientRenderer', () => {
  it('returns null without throwing when WebGL is unavailable', () => {
    const atlas = document.createElement('canvas');
    Object.defineProperty(atlas, 'getContext', { value: () => null });
    const host = document.createElement('div');
    const targets = WORKFLOW_VISUAL_ORDER.map((visual) => ({
      visual,
      canvas: document.createElement('canvas'),
    }));

    let renderer: ReturnType<typeof createWorkflowGradientRenderer>;
    expect(() => {
      renderer = createWorkflowGradientRenderer({ atlas, host, targets, reducedMotion: false });
    }).not.toThrow();
    expect(renderer!).toBeNull();
  });
});
