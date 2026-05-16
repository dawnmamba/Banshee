import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearAuthToken,
  getAuthToken,
  isAuthenticated,
  setAuthToken,
} from './auth';

const STORAGE_KEY = 'banshee_access_token';

describe('auth token storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores and retrieves token', () => {
    setAuthToken('abc');
    expect(getAuthToken()).toBe('abc');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('abc');
  });

  it('clears token', () => {
    setAuthToken('abc');
    clearAuthToken();
    expect(getAuthToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });

  it('reports authenticated when token exists', () => {
    setAuthToken('abc');
    expect(isAuthenticated()).toBe(true);
  });
});
