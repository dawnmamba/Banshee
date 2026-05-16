import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthGate } from './AuthGate';
import { setAuthToken, clearAuthToken } from '@/lib/auth';

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

  it('allows authenticated users on protected routes', async () => {
    setAuthToken('token');
    render(
      <AuthGate>
        <div>Protected</div>
      </AuthGate>,
    );

    expect(await screen.findByText('Protected')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('redirects authenticated users away from login', async () => {
    setAuthToken('token');
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
});
