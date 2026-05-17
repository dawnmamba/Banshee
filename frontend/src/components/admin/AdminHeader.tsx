'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  portalHeaderClass,
  portalNavLinkActiveClass,
  portalNavLinkClass,
} from '@/lib/theme/portal-theme';
import { LogoutButton } from '@/components/user-auth/LogoutButton';
import { portalButtonOutlineClass } from '@/lib/theme/portal-theme';

export function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className={portalHeaderClass}>
      <nav className="absolute left-8 flex items-center gap-6">
        <Link
          href="/admin"
          className={
            pathname === '/admin' ? portalNavLinkActiveClass : portalNavLinkClass
          }
        >
          Dashboard
        </Link>
        <Link
          href="/admin/users"
          className={
            pathname === '/admin/users'
              ? portalNavLinkActiveClass
              : portalNavLinkClass
          }
        >
          Users
        </Link>
      </nav>
      <span className="text-sm font-semibold tracking-wide text-slate-200">
        Banshee Admin
      </span>
      <LogoutButton className={portalButtonOutlineClass} />
    </header>
  );
}
