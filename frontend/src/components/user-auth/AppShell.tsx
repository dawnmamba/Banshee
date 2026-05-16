'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';
import { AuthGate } from './AuthGate';

const PUBLIC_PATHS = ['/login', '/register'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  return (
    <AuthGate>
      {!isPublic && <Navbar />}
      {children}
    </AuthGate>
  );
}
