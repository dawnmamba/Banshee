'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { SelectButton } from 'primereact/selectbutton';
import { fetchMe, logout, type AuthUser } from '@/lib/api';
import { useTheme } from './ThemeProvider';
import type { ThemePreference } from '@/lib/theme';

const THEME_OPTIONS: { label: string; value: ThemePreference }[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export function UserProfileMenu() {
  const router = useRouter();
  const panelRef = useRef<OverlayPanel>(null);
  const { preference, setPreference } = useTheme();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchMe()
      .then((profile) => {
        if (!cancelled) {
          setUser(profile);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load profile');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : 'Loading…';

  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false);
      panelRef.current?.hide();
      router.replace('/login');
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="User profile"
        data-testid="user-profile-trigger"
        className="cursor-pointer rounded-full border-0 bg-transparent p-0"
        onClick={(e) => panelRef.current?.toggle(e)}
      >
        <Avatar icon="pi pi-user" shape="circle" size="large" />
      </button>

      <OverlayPanel ref={panelRef} className="w-72">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar icon="pi pi-user" shape="circle" size="xlarge" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                {fullName}
              </p>
              <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                {user?.email ?? (error ? '—' : '…')}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Theme
            </p>
            <SelectButton
              value={preference}
              onChange={(e) => {
                if (e.value) {
                  setPreference(e.value as ThemePreference);
                }
              }}
              options={THEME_OPTIONS}
              className="w-full"
            />
          </div>

          <div className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
            <Button
              label={loading ? 'Signing out…' : 'Log out'}
              icon="pi pi-sign-out"
              severity="danger"
              outlined
              className="w-full"
              disabled={loading}
              onClick={() => void handleLogout()}
            />
          </div>
        </div>
      </OverlayPanel>
    </>
  );
}
