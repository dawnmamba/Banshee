'use client';

import { usePathname } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Navbar } from '@/components/navigation/Navbar';
import { isAdminPath, PUBLIC_PATHS } from '@/lib/roles';
import { AuthGate } from './AuthGate';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = (PUBLIC_PATHS as readonly string[]).includes(pathname);
  const isAdmin = isAdminPath(pathname);

  return (
    <AuthGate>
      <div className="flex min-h-0 flex-1 flex-col">
        {!isPublic && isAdmin && <AdminHeader />}
        {!isPublic && !isAdmin && <Navbar />}
        {children}
      </div>
    </AuthGate>
  );
}
