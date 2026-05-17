export const UserRole = {
  Admin: 'admin',
  User: 'user',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const PUBLIC_PATHS = ['/login', '/register'] as const;

export const USER_PATHS = ['/', '/profile', '/welcome', '/health'] as const;

export function isAdminPath(pathname: string): boolean {
  return (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/customers' ||
    pathname.startsWith('/customers/')
  );
}

export function isUserPath(pathname: string): boolean {
  return (USER_PATHS as readonly string[]).includes(pathname);
}

export function getRoleHomePath(role: UserRole): string {
  return role === UserRole.Admin ? '/admin' : '/';
}

export function isPathAllowedForRole(
  pathname: string,
  role: UserRole,
): boolean {
  if ((PUBLIC_PATHS as readonly string[]).includes(pathname)) {
    return true;
  }
  if (role === UserRole.Admin) {
    return isAdminPath(pathname);
  }
  return isUserPath(pathname);
}
