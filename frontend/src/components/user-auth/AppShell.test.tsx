import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppShell } from './AppShell';
import { setAuthToken } from '@/lib/auth';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ replace: vi.fn() }),
}));

vi.mock('@/components/user-profile-menu/UserProfileMenu', () => ({
  UserProfileMenu: () => <div data-testid="user-profile-menu">Profile</div>,
}));

vi.mock('./AuthGate', () => ({
  AuthGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('AppShell', () => {
  beforeEach(() => {
    setAuthToken('token');
  });

  it('renders profile menu on the left for protected routes', () => {
    render(
      <AppShell>
        <main>Content</main>
      </AppShell>,
    );

    expect(screen.getByTestId('user-profile-menu')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /log out/i }),
    ).not.toBeInTheDocument();
  });
});
