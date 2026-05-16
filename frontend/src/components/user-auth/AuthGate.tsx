'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '@/lib/auth';

const PUBLIC_PATHS = ['/login', '/register'];

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Client-only auth check: avoid reading localStorage during SSR/hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount gate
    setMounted(true);
  }, []);

  const isPublic = PUBLIC_PATHS.includes(pathname);
  const authed = mounted && isAuthenticated();
  const shouldRedirect =
    mounted && ((!authed && !isPublic) || (authed && isPublic));

  useEffect(() => {
    if (!mounted) {
      return;
    }
    if (!authed && !isPublic) {
      router.replace('/login');
    } else if (authed && isPublic) {
      router.replace('/');
    }
  }, [mounted, authed, isPublic, router]);

  if (!mounted || shouldRedirect) {
    return null;
  }

  return <>{children}</>;
}
