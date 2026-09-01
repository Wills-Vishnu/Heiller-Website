import { describe, expect, it } from 'vitest';
import {
  auditFaqs,
  complianceItems,
  homeNav,
  resultMetrics,
  servicePills,
  workflowCards,
} from './home-content';

describe('home content', () => {
  it('keeps collections uniquely addressable', () => {
    for (const collection of [
      complianceItems,
      servicePills,
      workflowCards,
      resultMetrics,
      auditFaqs,
    ]) {
      expect(new Set(collection.map((item) => item.id)).size).toBe(collection.length);
    }
  });

  it('uses the approved navigation anchors', () => {
    expect(homeNav.map((item) => item.href)).toEqual([
      '#services',
      '#approach',
      '#results',
      '#why-heiller',
      '#revenue-audit',
    ]);
  });

  it('qualifies all four figures as benchmarks or targets', () => {
    expect(resultMetrics.map((metric) => metric.value)).toEqual(['95%', '5%', '35', '96%']);
    expect(resultMetrics.every((metric) => /benchmark|target/i.test(metric.context))).toBe(true);
  });

  it('gives every service pill a distinct three-color palette', () => {
    expect(new Set(servicePills.map((pill) => `${pill.from}:${pill.to}:${pill.accent}`)).size).toBe(8);
    for (const pill of servicePills) {
      expect(pill.from).toMatch(/^#[0-9a-f]{6}$/i);
      expect(pill.to).toMatch(/^#[0-9a-f]{6}$/i);
      expect(pill.accent).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
