import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LogoutButton } from './LogoutButton';
import { setAuthToken, getAuthToken } from '@/lib/auth';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

describe('LogoutButton', () => {
  beforeEach(() => {
    setAuthToken('jwt-token');
    replace.mockClear();
    vi.restoreAllMocks();
  });

  it('clears token and navigates to login', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      }),
    );

    render(<LogoutButton />);
    await user.click(screen.getByRole('button', { name: /log out/i }));

    expect(getAuthToken()).toBeNull();
    expect(replace).toHaveBeenCalledWith('/login');
  });
});
