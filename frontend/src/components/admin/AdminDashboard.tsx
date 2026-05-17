'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Message } from 'primereact/message';
import {
  fetchAdminDashboard,
  fetchAdminUsers,
  fetchMe,
  type AdminDashboardStats,
  type AdminUserListItem,
  type AuthUser,
} from '@/lib/api';
import { errorMessagePt } from '@/lib/primereact/auth-pt';
import {
  adminCardClass,
  adminContainerClass,
  adminHeroClass,
  adminPageClass,
} from './admin-ui';
import { AdminQuickActionCard } from './AdminQuickActionCard';
import { AdminStatCard } from './AdminStatCard';

function sortRecentUsers(users: AdminUserListItem[]): AdminUserListItem[] {
  return [...users].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function AdminDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const [me, dashboard, usersResponse] = await Promise.all([
          fetchMe(),
          fetchAdminDashboard(),
          fetchAdminUsers(),
        ]);
        setUser(me);
        setStats(dashboard.stats);
        setRecentUsers(sortRecentUsers(usersResponse.users).slice(0, 5));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load dashboard',
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statValues = useMemo(
    () => ({
      total: stats?.totalUsers ?? '—',
      admins: stats?.adminCount ?? '—',
      users: stats?.userCount ?? '—',
    }),
    [stats],
  );

  return (
    <div className={adminPageClass}>
      <div className={adminContainerClass}>
        <section className={adminHeroClass}>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-zinc-900/5 via-transparent to-zinc-900/10 dark:from-zinc-100/5 dark:to-zinc-100/10"
            aria-hidden
          />
          <div className="relative">
            <p className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Operator console
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              {user
                ? `Welcome back, ${user.firstName}`
                : 'Welcome back'}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
              Monitor registered accounts, review roles, and jump into user
              management. Banking routes stay isolated from this workspace.
            </p>
          </div>
        </section>

        {error && (
          <Message
            severity="error"
            text={error}
            pt={errorMessagePt}
          />
        )}

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Overview
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AdminStatCard
              label="Total users"
              value={loading ? '…' : statValues.total}
              iconClass="pi pi-users"
              hint="All registered accounts"
            />
            <AdminStatCard
              label="Administrators"
              value={loading ? '…' : statValues.admins}
              iconClass="pi pi-shield"
              hint="Users with admin access"
            />
            <AdminStatCard
              label="Standard users"
              value={loading ? '…' : statValues.users}
              iconClass="pi pi-user"
              hint="Everyday banking accounts"
            />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Quick actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminQuickActionCard
              href="/admin/users"
              title="Manage users"
              description="Search accounts, review profiles, and promote or demote roles."
              iconClass="pi pi-list"
              cta="Open user directory"
            />
            <AdminQuickActionCard
              href="/admin/users"
              title="Role management"
              description="Keep admin access limited. Protected accounts cannot be changed from the list."
              iconClass="pi pi-lock"
              cta="Review permissions"
            />
          </div>
        </section>

        <section className={`${adminCardClass} overflow-hidden`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Recent registrations
              </h2>
              <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                Latest accounts in the system
              </p>
            </div>
            <Link
              href="/admin/users"
              className="text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-100"
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-zinc-500"
                    >
                      Loading…
                    </td>
                  </tr>
                )}
                {!loading && recentUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-zinc-500"
                    >
                      No users yet.
                    </td>
                  </tr>
                )}
                {!loading &&
                  recentUsers.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-zinc-100 dark:border-zinc-800"
                    >
                      <td className="px-6 py-3 text-zinc-900 dark:text-zinc-50">
                        {row.firstName} {row.lastName}
                      </td>
                      <td className="px-6 py-3 text-zinc-600 dark:text-zinc-400">
                        {row.email}
                      </td>
                      <td className="px-6 py-3 capitalize text-zinc-600 dark:text-zinc-400">
                        {row.role}
                      </td>
                      <td className="px-6 py-3 text-zinc-600 dark:text-zinc-400">
                        {new Date(row.createdAt).toLocaleDateString('en-GB')}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

