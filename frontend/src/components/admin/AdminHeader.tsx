'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { headerClass, linkMutedClass } from '@/lib/primereact/auth-pt';
import { LogoutButton } from '@/components/user-auth/LogoutButton';

const navLinkClass = (active: boolean) =>
  active
    ? 'text-sm font-semibold text-zinc-900 dark:text-zinc-50'
    : `${linkMutedClass} text-sm`;

export function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className={headerClass}>
      <nav className="absolute left-8 flex items-center gap-6">
        <Link href="/admin" className={navLinkClass(pathname === '/admin')}>
          Dashboard
        </Link>
        <Link
          href="/admin/users"
          className={navLinkClass(pathname === '/admin/users')}
        >
          Users
        </Link>
      </nav>
      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        Banshee Admin
      </span>
      <LogoutButton />
    </header>
  );
}
