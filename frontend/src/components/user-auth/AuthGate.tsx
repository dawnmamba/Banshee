'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAuthenticated } from '@/lib/auth';

const PUBLIC_PATHS = ['/login', '/register'];

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = PUBLIC_PATHS.includes(pathname);
  const authed = isAuthenticated();
  const shouldRedirect =
    (!authed && !isPublic) || (authed && isPublic);

  useEffect(() => {
    if (!authed && !isPublic) {
      router.replace('/login');
    } else if (authed && isPublic) {
      router.replace('/');
    }
  }, [authed, isPublic, router]);

  if (shouldRedirect) {
    return null;
  }

  return <>{children}</>;
}
