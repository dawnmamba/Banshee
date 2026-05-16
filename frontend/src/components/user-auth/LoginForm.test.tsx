import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from './LoginForm';
import { clearAuthToken, getAuthToken } from '@/lib/auth';

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
          },
        }),
      }),
    );

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(getAuthToken()).toBe('jwt-token');
      expect(replace).toHaveBeenCalledWith('/');
    });
  });
});
