import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { UserRole } from '@/lib/roles';
import { SEED_ADMIN_EMAIL } from '@/lib/admin';
import { AdminUserList } from './AdminUserList';
import * as api from '@/lib/api';

vi.mock('@/lib/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api')>();
  return {
    ...actual,
    fetchMe: vi.fn(),
    fetchAdminUsers: vi.fn(),
    updateAdminUserRole: vi.fn(),
  };
});

const sampleUser = {
  id: 'user-1',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  role: UserRole.User,
  accountNumber: 'ACC1',
  nic: '123456789V',
  mobile: '077',
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('AdminUserList', () => {
  beforeEach(() => {
    vi.mocked(api.fetchMe).mockResolvedValue({
      id: 'admin-actor',
      email: 'ops@banshee.local',
      firstName: 'Ops',
      lastName: 'Admin',
      role: UserRole.Admin,
    });
    vi.mocked(api.fetchAdminUsers).mockResolvedValue({ users: [sampleUser] });
    vi.mocked(api.updateAdminUserRole).mockResolvedValue({
      ...sampleUser,
      role: UserRole.Admin,
    });
    vi.stubGlobal('confirm', vi.fn(() => true));
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders users from API', async () => {
    renderWithProviders(<AdminUserList />);

    expect(await screen.findByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('ACC1')).toBeInTheDocument();
  });

  it('searches users when submitting search', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminUserList />);

    await screen.findByText('Jane Doe');

    await user.type(screen.getByLabelText(/search users/i), 'jane');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(api.fetchAdminUsers).toHaveBeenCalledWith('jane');
    });
  });

  it('promotes user after confirmation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminUserList />);

    await screen.findByText('Jane Doe');
    await user.click(screen.getByRole('button', { name: /make admin/i }));

    await waitFor(() => {
      expect(api.updateAdminUserRole).toHaveBeenCalledWith('user-1', UserRole.Admin);
    });
  });

  it('does not show role action for seed admin', async () => {
    vi.mocked(api.fetchAdminUsers).mockResolvedValue({
      users: [
        {
          ...sampleUser,
          id: 'seed-1',
          email: SEED_ADMIN_EMAIL,
          role: UserRole.Admin,
          firstName: 'System',
          lastName: 'Administrator',
        },
      ],
    });

    renderWithProviders(<AdminUserList />);

    await screen.findByText('System Administrator');
    expect(screen.queryByRole('button', { name: /make user/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /make admin/i })).toBeNull();
  });
});
