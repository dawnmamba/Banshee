'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import {
  fetchAdminUsers,
  fetchMe,
  updateAdminUserRole,
  type AdminUserListItem,
} from '@/lib/api';
import { SEED_ADMIN_EMAIL } from '@/lib/admin';
import { UserRole } from '@/lib/roles';
import {
  errorMessagePt,
  labelClass,
  secondaryButtonClass,
  successMessagePt,
} from '@/lib/primereact/auth-pt';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB');
}

function canChangeRole(
  user: AdminUserListItem,
  actorId: string | null,
): boolean {
  if (!actorId) {
    return false;
  }
  if (user.email === SEED_ADMIN_EMAIL) {
    return false;
  }
  if (user.id === actorId) {
    return false;
  }
  return true;
}

export function AdminUserList() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [actorId, setActorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadUsers = useCallback(async (term?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminUsers(term);
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const me = await fetchMe();
        setActorId(me.id);
      } catch {
        setActorId(null);
      }
      await loadUsers();
    })();
  }, [loadUsers]);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    await loadUsers(search);
  }

  async function handleRoleChange(user: AdminUserListItem, role: UserRole) {
    const label = role === UserRole.Admin ? 'admin' : 'user';
    const confirmed = window.confirm(
      `Change ${user.firstName} ${user.lastName} to ${label}?`,
    );
    if (!confirmed) {
      return;
    }

    setUpdatingId(user.id);
    setError(null);
    setSuccess(null);
    try {
      const updated = await updateAdminUserRole(user.id, role);
      setUsers((prev) =>
        prev.map((row) => (row.id === updated.id ? updated : row)),
      );
      setSuccess(`Updated ${updated.firstName} ${updated.lastName} to ${label}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Users
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          View accounts and change roles. The system admin and your own account
          cannot be modified here.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label htmlFor="user-search" className={labelClass}>
            Search users
          </label>
          <InputText
            id="user-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name or email"
            className="w-full"
          />
        </div>
        <Button
          type="submit"
          label="Search"
          className={secondaryButtonClass}
          disabled={loading}
        />
      </form>

      {error && (
        <Message
          severity="error"
          text={error}
          pt={errorMessagePt}
          className="mb-4"
        />
      )}
      {success && (
        <Message
          severity="success"
          text={success}
          pt={successMessagePt}
          className="mb-4"
        />
      )}

      <div className="overflow-x-auto rounded-2xl border border-black/[.08] bg-white shadow-sm dark:border-white/[.145] dark:bg-zinc-950">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                Name
              </th>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </th>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                Role
              </th>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                Account
              </th>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                NIC
              </th>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                Mobile
              </th>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                Joined
              </th>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400"
                >
                  Loading users…
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400"
                >
                  No users found.
                </td>
              </tr>
            )}
            {!loading &&
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-zinc-100 dark:border-zinc-800"
                >
                  <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 capitalize text-zinc-700 dark:text-zinc-300">
                    {user.role}
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                    {user.accountNumber ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                    {user.nic ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                    {user.mobile ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    {canChangeRole(user, actorId) ? (
                      user.role === UserRole.User ? (
                        <Button
                          type="button"
                          label="Make admin"
                          className={secondaryButtonClass}
                          disabled={updatingId === user.id}
                          onClick={() =>
                            void handleRoleChange(user, UserRole.Admin)
                          }
                        />
                      ) : (
                        <Button
                          type="button"
                          label="Make user"
                          className={secondaryButtonClass}
                          disabled={updatingId === user.id}
                          onClick={() =>
                            void handleRoleChange(user, UserRole.User)
                          }
                        />
                      )
                    ) : (
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        Protected
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
