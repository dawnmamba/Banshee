import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Navbar } from './Navbar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/transactions',
}));

vi.mock('@/components/user-profile-menu/UserProfileMenu', () => ({
  UserProfileMenu: () => <div data-testid="user-profile-menu">Profile</div>,
}));

describe('Navbar', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders Home and Transactions nav links only', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Transactions' })).toHaveAttribute(
      'href',
      '/transactions',
    );
    expect(screen.queryByRole('link', { name: 'Health' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Welcome' })).not.toBeInTheDocument();
  });

  it('marks the active route', () => {
    render(<Navbar />);

    const transactionsLink = screen.getByRole('link', { name: 'Transactions' });
    expect(transactionsLink).toHaveAttribute('aria-current', 'page');
    expect(transactionsLink.className).toContain('font-medium');
  });
});

