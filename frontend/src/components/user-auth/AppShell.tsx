'use client';

import { usePathname } from 'next/navigation';
import { AuthGate } from './AuthGate';
import { UserProfileMenu } from '@/components/user-profile-menu/UserProfileMenu';

const PUBLIC_PATHS = ['/login', '/register'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  return (
    <AuthGate>
      {!isPublic && (
        <header className="flex items-center border-b border-zinc-200 px-6 py-3 dark:border-zinc-800">
          <UserProfileMenu />
        </header>
      )}
      {children}
    </AuthGate>
  );
}
