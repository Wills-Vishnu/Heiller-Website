import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { PrivacyDrawer } from './PrivacyDrawer';

describe('PrivacyDrawer', () => {
  beforeEach(() => window.history.replaceState(null, '', '/'));

  it('opens from the Privacy link with Heiller-specific copy', () => {
    render(<PrivacyDrawer />);
    fireEvent.click(screen.getByRole('button', { name: 'Privacy' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Privacy notice' })).toBeInTheDocument();
    expect(screen.getByText('connect@heillerrcm.com')).toHaveAttribute('href', 'mailto:connect@heillerrcm.com');
    expect(screen.queryByText(/Access Healthcare/i)).not.toBeInTheDocument();
  });

  it('opens from and clears the privacy hash', () => {
    window.history.replaceState(null, '', '/#privacy');
    render(<PrivacyDrawer />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close privacy notice' }));
    expect(window.location.hash).toBe('');
  });

  it('locks landing-page scrolling while the drawer is open and restores it on close', () => {
    render(<PrivacyDrawer />);
    fireEvent.click(screen.getByRole('button', { name: 'Privacy' }));

    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.position).toBe('fixed');

    const drawerScroller = screen.getByTestId('privacy-scroll-area');
    fireEvent.wheel(screen.getByRole('dialog'), { deltaY: 240 });
    expect(drawerScroller.scrollTop).toBe(240);

    fireEvent.click(screen.getByRole('button', { name: 'Close privacy notice' }));
    expect(document.documentElement.style.overflow).toBe('');
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.position).toBe('');
  });
});
