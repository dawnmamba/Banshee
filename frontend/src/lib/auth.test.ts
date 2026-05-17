import { beforeEach, describe, expect, it } from 'vitest';
import { UserRole } from './roles';
import {
  clearAuthToken,
  getAuthToken,
  getUserRole,
  isAuthenticated,
  setAuthSession,
  STORAGE_KEY,
} from './auth';

describe('auth session storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores and retrieves token and role', () => {
    setAuthSession('abc', UserRole.Admin);
    expect(getAuthToken()).toBe('abc');
    expect(getUserRole()).toBe(UserRole.Admin);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('abc');
  });

  it('clears token and role', () => {
    setAuthSession('abc', UserRole.User);
    clearAuthToken();
    expect(getAuthToken()).toBeNull();
    expect(getUserRole()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });

  it('reports authenticated when token exists', () => {
    setAuthSession('abc', UserRole.User);
    expect(isAuthenticated()).toBe(true);
  });
});
