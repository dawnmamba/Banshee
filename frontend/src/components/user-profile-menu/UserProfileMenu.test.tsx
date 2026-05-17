import { screen, waitFor, cleanup } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { UserProfileMenu } from './UserProfileMenu';
import { UserRole } from '@/lib/roles';
import { setAuthSession } from '@/lib/auth';

const push = vi.fn();
const replace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
}));

function renderMenu() {
  return renderWithProviders(<UserProfileMenu />);
}

describe('UserProfileMenu', () => {
  beforeEach(() => {
    setAuthSession('jwt-token', UserRole.User);
    push.mockClear();
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
              role: UserRole.User,
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

  it('navigates to profile when Profile is clicked', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          id: '1',
          email: 'a@b.com',
          firstName: 'Jane',
          lastName: 'Doe',
          role: UserRole.User,
        }),
      }),
    );

    renderMenu();
    await user.click(screen.getByTestId('user-profile-trigger'));
    await user.click(
      screen.getByRole('menuitem', { name: /profile/i, hidden: true }),
    );

    expect(push).toHaveBeenCalledWith('/profile');
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

    const panel = screen.getByRole('group', { hidden: true });
    expect(panel.querySelector('.pi-desktop')).toBeInTheDocument();
    expect(panel.querySelector('.pi-sun')).toBeInTheDocument();
    expect(panel.querySelector('.pi-moon')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /log out/i, hidden: true }),
    ).toBeInTheDocument();
  });

  it('applies dark class when dark theme is selected', async () => {
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

    document.documentElement.classList.remove('dark');
    renderMenu();
    await user.click(screen.getByTestId('user-profile-trigger'));
    await user.click(screen.getByRole('button', { name: /dark/i, hidden: true }));

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('banshee-theme')).toBe('dark');
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
