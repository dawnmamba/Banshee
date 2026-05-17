import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, it, expect, vi, beforeEach } from 'vitest';
import { UserRole } from '@/lib/roles';
import { setAuthSession, clearAuthToken } from '@/lib/auth';
import { AuthGate } from './AuthGate';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: () => ({ replace }),
}));

import { usePathname } from 'next/navigation';

describe('AuthGate', () => {
  beforeEach(() => {
    clearAuthToken();
    replace.mockClear();
    vi.mocked(usePathname).mockReturnValue('/');
  });

  afterEach(() => {
    cleanup();
  });

  it('redirects unauthenticated users to login', async () => {
    render(
      <AuthGate>
        <div>Protected</div>
      </AuthGate>,
    );

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('/login');
    });
    expect(screen.queryByText('Protected')).not.toBeInTheDocument();
  });

  it('allows authenticated users on user routes', async () => {
    setAuthSession('token', UserRole.User);
    render(
      <AuthGate>
        <div>Protected</div>
      </AuthGate>,
    );

    expect(await screen.findByText('Protected')).toBeInTheDocument();
    expect(screen.queryByText('Page not found')).not.toBeInTheDocument();
  });

  it('redirects authenticated users away from login to role home', async () => {
    setAuthSession('token', UserRole.User);
    vi.mocked(usePathname).mockReturnValue('/login');

    render(
      <AuthGate>
        <div>Login page</div>
      </AuthGate>,
    );

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('/');
    });
  });

  it('redirects admin away from login to /admin', async () => {
    setAuthSession('token', UserRole.Admin);
    vi.mocked(usePathname).mockReturnValue('/login');

    render(
      <AuthGate>
        <div>Login page</div>
      </AuthGate>,
    );

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('/admin');
    });
  });

  it('shows role not found when admin visits user route', async () => {
    setAuthSession('token', UserRole.Admin);
    vi.mocked(usePathname).mockReturnValue('/');

    render(
      <AuthGate>
        <div>User home</div>
      </AuthGate>,
    );

    expect(await screen.findByText('Page not found')).toBeInTheDocument();
    expect(screen.queryByText('User home')).not.toBeInTheDocument();
  });

  it('shows role not found when user visits admin route', async () => {
    setAuthSession('token', UserRole.User);
    vi.mocked(usePathname).mockReturnValue('/admin');

    render(
      <AuthGate>
        <div>Admin</div>
      </AuthGate>,
    );

    expect(await screen.findByText('Page not found')).toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });
});
