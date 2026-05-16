import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Navbar } from './Navbar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/health',
}));

vi.mock('@/components/user-profile-menu/UserProfileMenu', () => ({
  UserProfileMenu: () => <div data-testid="user-profile-menu">Profile</div>,
}));

describe('Navbar', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders nav links', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Health' })).toHaveAttribute(
      'href',
      '/health',
    );
    expect(screen.getByRole('link', { name: 'Welcome' })).toHaveAttribute(
      'href',
      '/welcome',
    );
  });

  it('marks the active route', () => {
    render(<Navbar />);

    const healthLink = screen.getByRole('link', { name: 'Health' });
    expect(healthLink).toHaveAttribute('aria-current', 'page');
    expect(healthLink.className).toContain('font-medium');
  });
});
