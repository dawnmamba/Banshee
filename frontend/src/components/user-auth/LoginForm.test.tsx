import { cleanup, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LoginForm } from './LoginForm';
import { UserRole } from '@/lib/roles';
import { clearAuthToken, getAuthToken, getUserRole } from '@/lib/auth';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    clearAuthToken();
    replace.mockClear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('submits login and stores token', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          accessToken: 'jwt-token',
          user: {
            id: '1',
            email: 'a@b.com',
            firstName: 'Jane',
            lastName: 'Doe',
            role: UserRole.User,
          },
        }),
      }),
    );

    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(getAuthToken()).toBe('jwt-token');
      expect(getUserRole()).toBe(UserRole.User);
      expect(replace).toHaveBeenCalledWith('/');
    });
  });

  it('redirects admin to /admin after login', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          accessToken: 'jwt-token',
          user: {
            id: '1',
            email: 'admin@banshee.local',
            firstName: 'System',
            lastName: 'Administrator',
            role: UserRole.Admin,
          },
        }),
      }),
    );

    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'admin@banshee.local');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(getUserRole()).toBe(UserRole.Admin);
      expect(replace).toHaveBeenCalledWith('/admin');
    });
  });
});
