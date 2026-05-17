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
import { errorMessagePt, successMessagePt } from '@/lib/primereact/auth-pt';
import { portalButtonOutlineClass } from '@/lib/theme/portal-theme';
import {
  adminCardClass,
  adminCardGlowClass,
  adminContainerClass,
  adminFormInputClass,
  adminFormLabelClass,
  adminPageClass,
  adminSectionLabelClass,
  adminTableHeadClass,
  adminTableRowClass,
} from './admin-ui';

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
    <div className={adminPageClass}>
      <div className={adminContainerClass}>
      <div className="mb-6">
        <p className={adminSectionLabelClass}>Directory</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Users</h1>
        <p className="mt-2 text-sm text-slate-400">
          View accounts and change roles. The system admin and your own account
          cannot be modified here.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="mb-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
      >
        <div className="min-w-0">
          <label htmlFor="user-search" className={adminFormLabelClass}>
            Search users
          </label>
          <InputText
            id="user-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name or email"
            pt={{ root: { className: adminFormInputClass } }}
          />
        </div>
        <Button
          type="submit"
          label="Search"
          className={`${portalButtonOutlineClass} w-full sm:w-auto`}
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

      <div
        className={`${adminCardClass} ${adminCardGlowClass} relative overflow-x-auto`}
      >
        <table className="min-w-full text-left text-sm">
          <thead className={adminTableHeadClass}>
            <tr>
              <th className="px-4 py-3 font-medium text-slate-400">
                Name
              </th>
              <th className="px-4 py-3 font-medium text-slate-400">
                Email
              </th>
              <th className="px-4 py-3 font-medium text-slate-400">
                Role
              </th>
              <th className="px-4 py-3 font-medium text-slate-400">
                Account
              </th>
              <th className="px-4 py-3 font-medium text-slate-400">
                NIC
              </th>
              <th className="px-4 py-3 font-medium text-slate-400">
                Mobile
              </th>
              <th className="px-4 py-3 font-medium text-slate-400">
                Joined
              </th>
              <th className="px-4 py-3 font-medium text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Loading users…
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No users found.
                </td>
              </tr>
            )}
            {!loading &&
              users.map((user) => (
                <tr key={user.id} className={adminTableRowClass}>
                  <td className="px-4 py-3 text-white">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{user.email}</td>
                  <td className="px-4 py-3 capitalize text-slate-400">
                    {user.role}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {user.accountNumber ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{user.nic ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {user.mobile ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    {canChangeRole(user, actorId) ? (
                      user.role === UserRole.User ? (
                        <Button
                          type="button"
                          label="Make admin"
                          className={portalButtonOutlineClass}
                          disabled={updatingId === user.id}
                          onClick={() =>
                            void handleRoleChange(user, UserRole.Admin)
                          }
                        />
                      ) : (
                        <Button
                          type="button"
                          label="Make user"
                          className={portalButtonOutlineClass}
                          disabled={updatingId === user.id}
                          onClick={() =>
                            void handleRoleChange(user, UserRole.User)
                          }
                        />
                      )
                    ) : (
                      <span className="text-xs text-slate-600">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
