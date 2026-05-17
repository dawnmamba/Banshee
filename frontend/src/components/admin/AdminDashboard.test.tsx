import { cleanup, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { UserRole } from '@/lib/roles';
import { AdminDashboard } from './AdminDashboard';
import * as api from '@/lib/api';

vi.mock('@/lib/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api')>();
  return {
    ...actual,
    fetchMe: vi.fn(),
    fetchAdminDashboard: vi.fn(),
    fetchAdminUsers: vi.fn(),
  };
});

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.mocked(api.fetchMe).mockResolvedValue({
      id: 'admin-1',
      email: 'ops@banshee.local',
      firstName: 'Alex',
      lastName: 'Operator',
      role: UserRole.Admin,
    });
    vi.mocked(api.fetchAdminDashboard).mockResolvedValue({
      message: 'Admin dashboard',
      stats: { totalUsers: 10, adminCount: 2, userCount: 8 },
    });
    vi.mocked(api.fetchAdminUsers).mockResolvedValue({
      users: [
        {
          id: 'u1',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          role: UserRole.User,
          accountNumber: null,
          nic: null,
          mobile: null,
          createdAt: '2026-05-10T00:00:00.000Z',
        },
      ],
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('shows welcome, stats, and manage users link', async () => {
    renderWithProviders(<AdminDashboard />);

    expect(await screen.findByText(/welcome back, alex/i)).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Total users')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /manage users/i })).toHaveAttribute(
      'href',
      '/admin/users',
    );
  });

  it('lists recent users', async () => {
    renderWithProviders(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });
});
