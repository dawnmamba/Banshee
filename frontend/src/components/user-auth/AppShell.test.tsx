import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppShell } from './AppShell';
import { setAuthToken } from '@/lib/auth';

const mockPathname = vi.fn(() => '/');

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ replace: vi.fn() }),
}));

vi.mock('@/components/navigation/Navbar', () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock('./AuthGate', () => ({
  AuthGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('AppShell', () => {
  beforeEach(() => {
    setAuthToken('token');
  });

  it('hides navbar on public auth routes', () => {
    mockPathname.mockReturnValue('/login');
    render(
      <AppShell>
        <main>Login</main>
      </AppShell>,
    );

    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
  });

  it('renders navbar on protected routes', () => {
    mockPathname.mockReturnValue('/');
    render(
      <AppShell>
        <main>Content</main>
      </AppShell>,
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /log out/i }),
    ).not.toBeInTheDocument();
  });
});
