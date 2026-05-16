import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { UserProfileMenu } from './UserProfileMenu';
import { Providers } from './Providers';
import { setAuthToken } from '@/lib/auth';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

function renderMenu() {
  return render(
    <Providers>
      <UserProfileMenu />
    </Providers>,
  );
}

describe('UserProfileMenu', () => {
  beforeEach(() => {
    setAuthToken('jwt-token');
    replace.mockClear();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows user full name and email in the menu', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (String(url).includes('/auth/me')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              id: '1',
              email: 'jane@example.com',
              firstName: 'Jane',
              lastName: 'Doe',
            }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ ok: true }),
        });
      }),
    );

    renderMenu();
    await user.click(screen.getByTestId('user-profile-trigger'));

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('shows theme options and logout at the bottom', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          id: '1',
          email: 'a@b.com',
          firstName: 'A',
          lastName: 'B',
        }),
      }),
    );

    renderMenu();
    await user.click(screen.getByTestId('user-profile-trigger'));

    expect(
      screen.getByRole('button', { name: /^system$/i, hidden: true }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^light$/i, hidden: true }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^dark$/i, hidden: true }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /log out/i, hidden: true }),
    ).toBeInTheDocument();
  });

  it('logs out and navigates to login', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          id: '1',
          email: 'a@b.com',
          firstName: 'A',
          lastName: 'B',
        }),
      }),
    );

    renderMenu();
    await user.click(screen.getByTestId('user-profile-trigger'));
    await user.click(
      screen.getByRole('button', { name: /log out/i, hidden: true }),
    );

    expect(replace).toHaveBeenCalledWith('/login');
  });
});
