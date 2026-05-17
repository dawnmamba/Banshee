'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserRole, isAuthenticated } from '@/lib/auth';
import {
  getRoleHomePath,
  isPathAllowedForRole,
  PUBLIC_PATHS,
} from '@/lib/roles';
import { RoleNotFound } from './RoleNotFound';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount gate
    setMounted(true);
  }, []);

  const isPublic = (PUBLIC_PATHS as readonly string[]).includes(pathname);
  const authed = mounted && isAuthenticated();
  const role = mounted ? getUserRole() : null;
  const wrongRole =
    mounted && authed && role !== null && !isPathAllowedForRole(pathname, role);
  const shouldRedirect =
    mounted && ((!authed && !isPublic) || (authed && isPublic && role !== null));

  useEffect(() => {
    if (!mounted) {
      return;
    }
    if (!authed && !isPublic) {
      router.replace('/login');
    } else if (authed && isPublic && role !== null) {
      router.replace(getRoleHomePath(role));
    }
  }, [mounted, authed, isPublic, role, router]);

  if (wrongRole) {
    return <RoleNotFound />;
  }

  if (!mounted || shouldRedirect) {
    return null;
  }

  return <>{children}</>;
}
