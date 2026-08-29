import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HomeExperience } from './HomeExperience';

vi.mock('@/lib/gsap', () => ({
  gsap: {
    matchMedia: () => ({ add: () => undefined, revert: () => undefined }),
    from: () => undefined,
    to: () => undefined,
    utils: { toArray: () => [] },
  },
  useGSAP: () => undefined,
}));

vi.mock('@/lib/workflow-gradient-renderer', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/workflow-gradient-renderer')>();
  return { ...original, createWorkflowGradientRenderer: () => null };
});

vi.mock('@/lib/metric-mesh-renderer', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/metric-mesh-renderer')>();
  return { ...original, createMetricMeshRenderer: () => null };
});

describe('HomeExperience', () => {
  it('renders the approved section order and a single page heading', () => {
    const { container } = render(<HomeExperience />);
    const ids = Array.from(container.querySelectorAll('[data-home-section]')).map((node) => node.id);
    expect(ids).toEqual([
      'top',
      'services',
      'approach',
      'results',
      'why-heiller',
      'team-extension',
      'revenue-audit',
      'footer',
    ]);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('keeps every primary navigation target on the page', () => {
    const { container } = render(<HomeExperience />);
    for (const link of screen.getByRole('navigation', { name: 'Primary' }).querySelectorAll('a')) {
      expect(container.querySelector(link.getAttribute('href')!)).toBeInTheDocument();
    }
  });

  it('closes the mobile menu when the page scrolls', () => {
    render(<HomeExperience />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');

    fireEvent.scroll(window);

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps the hero free of the announcement strip and decorative note cards', () => {
    const { container } = render(<HomeExperience />);
    const hero = container.querySelector<HTMLElement>('#top')!;
    expect(within(hero).queryByText('Free revenue audit for healthcare teams')).not.toBeInTheDocument();
    expect(within(hero).queryByText('Claims moving')).not.toBeInTheDocument();
    expect(within(hero).queryByText('Resolve the cause')).not.toBeInTheDocument();
  });

  it('uses one decorative interactive grid and no hero shader canvas', () => {
    const { container } = render(<HomeExperience />);
    const hero = container.querySelector<HTMLElement>('#top')!;
    expect(hero.querySelectorAll('[data-interactive-grid]')).toHaveLength(1);
    expect(hero.querySelector('[data-hero-shader]')).not.toBeInTheDocument();
  });

  it('places the full V2 flow beside the hero copy', () => {
    const { container } = render(<HomeExperience />);
    const hero = container.querySelector<HTMLElement>('#top')!;
    expect(hero.querySelectorAll('[data-hero-flow]')).toHaveLength(1);
    expect(hero.querySelectorAll('[data-flow-node]')).toHaveLength(8);
  });

  it('removes the lower hero metadata at every breakpoint', () => {
    const { container } = render(<HomeExperience />);
    const hero = container.querySelector<HTMLElement>('#top')!;
    expect(within(hero).queryByText('Healthcare revenue operations')).not.toBeInTheDocument();
    expect(within(hero).queryByText('Scroll to explore')).not.toBeInTheDocument();
    expect(hero.querySelector('[class*=heroLower]')).not.toBeInTheDocument();
  });

  it('keeps a single-piece header CTA with its approved destination', () => {
    const { container } = render(<HomeExperience />);
    const header = container.querySelector('header')!;
    const cta = within(header).getByRole('link', { name: /Get a free revenue audit/i });
    expect(cta).toHaveAttribute('href', '#revenue-audit');
    expect(cta).toHaveAttribute('data-header-cta');
    expect(cta.querySelector('[class*=arrowSquare]')).not.toBeInTheDocument();
  });

  it('renders the approved Approach introduction without secondary copy', () => {
    const { container } = render(<HomeExperience />);
    const approach = container.querySelector<HTMLElement>('#approach')!;
    expect(within(approach).getByText('You focus on care.')).toBeInTheDocument();
    expect(within(approach).getByText('We’ll keep the work behind it secure and supported.')).toBeInTheDocument();
    expect(within(approach).queryByText(/Revenue-cycle work carries sensitive information/)).not.toBeInTheDocument();
  });

  it('exposes one orbit field containing all eight connected-team pills', () => {
    const { container } = render(<HomeExperience />);
    const field = container.querySelector<HTMLElement>('[data-pill-field]');
    expect(field).toBeInTheDocument();
    expect(field?.querySelectorAll('[data-service-pill]')).toHaveLength(8);
    expect(field?.querySelectorAll('[data-pill-palette]')).toHaveLength(8);
  });

  it('moves the team statement and CTA into the route-style Why section', () => {
    const { container } = render(<HomeExperience />);
    const services = container.querySelector<HTMLElement>('#services')!;
    const why = container.querySelector<HTMLElement>('#why-heiller')!;
    expect(within(services).queryByText(/At Heiller, we work as an extension/)).not.toBeInTheDocument();
    expect(within(why).getByText(/At Heiller, we work as an extension/)).toBeInTheDocument();
    expect(within(why).getByText('Why Heiller')).toBeInTheDocument();
    expect(within(why).getByRole('link', { name: /See how we work/i })).toHaveAttribute('href', '#team-extension');
    expect(why.querySelectorAll('[class*=reasonPathGlow]')).toHaveLength(20);
  });

  it('integrates Why Heiller numbering into the reason headings', () => {
    const { container } = render(<HomeExperience />);
    const why = container.querySelector<HTMLElement>('#why-heiller')!;
    expect(within(why).getByRole('heading', { name: '1. One accountable owner' })).toBeInTheDocument();
    expect(within(why).getByRole('heading', { name: '5. A flexible extension' })).toBeInTheDocument();
    expect(why.querySelectorAll('[data-reason-ordinal]')).toHaveLength(0);
  });

  it('uses four shared-mesh value slots on neutral result cards', () => {
    const { container } = render(<HomeExperience />);
    const results = container.querySelector<HTMLElement>('#results')!;
    expect(results.querySelectorAll('[data-metric-mesh-source]')).toHaveLength(1);
    expect(results.querySelectorAll('[data-metric-mesh]')).toHaveLength(4);
    expect(results.querySelector('[class*=metricAccent]')).not.toBeInTheDocument();
    for (const value of ['95%', '5%', '35', '96%']) expect(within(results).getByText(value)).toBeInTheDocument();
  });

  it('renders shared sentence-case eyebrows with decorative markers', () => {
    const { container } = render(<HomeExperience />);
    for (const label of [
      'Our approach',
      'Performance standard', 'Why Heiller', 'Free revenue audit', 'Faq',
    ]) expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.queryByText('One connected team')).not.toBeInTheDocument();
    // The workflow ledger leads on its centred heading alone, no eyebrow.
    expect(screen.queryByText('How we plug in')).not.toBeInTheDocument();
    expect(container.querySelectorAll('[data-eyebrow]')).toHaveLength(5);
    expect(container.querySelectorAll('[data-eyebrow-marker][aria-hidden="true"]')).toHaveLength(5);
  });

  it('opens FAQ answers and renders the live Cal.com booking flow without a duplicate form', () => {
    const { container } = render(<HomeExperience />);
    const timing = screen.getByRole('button', { name: 'How long does it take?' });
    fireEvent.click(timing);
    expect(timing).toHaveAttribute('aria-expanded', 'true');

    const audit = container.querySelector<HTMLElement>('#revenue-audit')!;
    expect(audit.querySelector('[data-cal-link="heiller/revenue-audit"]')).toBeInTheDocument();
    expect(within(audit).queryByRole('form')).not.toBeInTheDocument();
    expect(within(audit).queryByText(/Trouble loading the calendar/i)).not.toBeInTheDocument();
  });

  it('uses the footer Privacy control to open the privacy drawer', () => {
    render(<HomeExperience />);
    fireEvent.click(screen.getByRole('button', { name: 'Privacy' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Privacy notice' })).toBeInTheDocument();
  });
});
