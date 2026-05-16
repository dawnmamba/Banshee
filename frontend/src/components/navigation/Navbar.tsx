'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { headerClass, linkClass, linkMutedClass } from '@/lib/primereact/auth-pt';
import { UserProfileMenu } from '@/components/user-profile-menu/UserProfileMenu';
import { NAV_ROUTES } from './nav-routes';

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className={headerClass}>
      <nav aria-label="Main" className="flex items-center gap-6">
        {NAV_ROUTES.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={isActive ? linkClass : linkMutedClass}
              aria-current={isActive ? 'page' : undefined}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <UserProfileMenu />
    </header>
  );
}
