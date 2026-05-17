'use client';

import { headerClass } from '@/lib/primereact/auth-pt';
import { LogoutButton } from '@/components/user-auth/LogoutButton';

export function AdminHeader() {
  return (
    <header className={headerClass}>
      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        Banshee Admin
      </span>
      <LogoutButton />
    </header>
  );
}
