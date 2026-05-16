'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { SelectButton } from 'primereact/selectbutton';
import { fetchMe, logout, type AuthUser } from '@/lib/api';
import {
  logoutButtonPt,
  navAvatarPanelClass,
  navAvatarTriggerClass,
  secondaryButtonClass,
} from '@/lib/primereact/auth-pt';
import { useTheme } from './ThemeProvider';
import type { ThemePreference } from '@/lib/theme';

type ThemeOption = {
  value: ThemePreference;
  title: string;
  icon: string;
};

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'system', title: 'System', icon: 'pi pi-desktop' },
  { value: 'light', title: 'Light', icon: 'pi pi-sun' },
  { value: 'dark', title: 'Dark', icon: 'pi pi-moon' },
];

const avatarTriggerPt = {
  root: { className: navAvatarTriggerClass },
  icon: { className: 'text-xl' },
};

const avatarPanelPt = {
  root: { className: navAvatarPanelClass },
  icon: { className: 'text-2xl' },
};

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

  function handleProfile() {
    panelRef.current?.hide();
    router.push('/profile');
  }

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
        <Avatar icon="pi pi-user" shape="circle" pt={avatarTriggerPt} />
      </button>

      <OverlayPanel ref={panelRef} className="w-80">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar icon="pi pi-user" shape="circle" pt={avatarPanelPt} />
            <div className="min-w-0 flex-1">
              {user ? (
                <p className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {user.firstName} {user.lastName}
                </p>
              ) : (
                <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {error ? 'Profile unavailable' : 'Loading…'}
                </p>
              )}
              <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
                {user?.email ?? (error ? '—' : '…')}
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            <button
              type="button"
              role="menuitem"
              className={secondaryButtonClass}
              onClick={handleProfile}
            >
              Profile
            </button>
          </nav>

          <SelectButton
            value={preference}
            allowEmpty={false}
            onChange={(e) => {
              const next = e.value as ThemePreference | null;
              if (next) {
                setPreference(next);
              }
            }}
            options={THEME_OPTIONS}
            optionLabel="title"
            optionValue="value"
            itemTemplate={(option: ThemeOption) => (
              <>
                <i className={`${option.icon} text-base`} aria-hidden />
                <span className="sr-only">{option.title}</span>
              </>
            )}
          />

          <div className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
            <Button
              type="button"
              label={loading ? 'Signing out…' : 'Log out'}
              icon="pi pi-sign-out"
              iconPos="right"
              pt={logoutButtonPt}
              disabled={loading}
              onClick={() => void handleLogout()}
            />
          </div>
        </div>
      </OverlayPanel>
    </>
  );
}
