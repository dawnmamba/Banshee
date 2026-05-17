import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { AdminHeader } from './AdminHeader';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/admin/users',
}));

describe('AdminHeader', () => {
  afterEach(() => {
    cleanup();
  });

  it('links to dashboard and users', () => {
    renderWithProviders(<AdminHeader />);

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute(
      'href',
      '/admin',
    );
    expect(screen.getByRole('link', { name: /users/i })).toHaveAttribute(
      'href',
      '/admin/users',
    );
  });
});
