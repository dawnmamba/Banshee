import type { UserRole } from './roles';

const TOKEN_KEY = 'banshee_access_token';
const ROLE_KEY = 'banshee_user_role';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUserRole(): UserRole | null {
  if (typeof window === 'undefined') return null;
  const role = localStorage.getItem(ROLE_KEY);
  if (role === 'admin' || role === 'user') {
    return role;
  }
  return null;
}

export function setAuthSession(token: string, role: UserRole): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

export { TOKEN_KEY as STORAGE_KEY };
