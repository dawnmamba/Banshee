import { describe, expect, it } from 'vitest';
import {
  getRoleHomePath,
  isAdminPath,
  isPathAllowedForRole,
  isUserPath,
  UserRole,
} from './roles';

describe('route groups', () => {
  it('detects admin paths', () => {
    expect(isAdminPath('/admin')).toBe(true);
    expect(isAdminPath('/admin/settings')).toBe(true);
    expect(isAdminPath('/customers')).toBe(true);
    expect(isAdminPath('/customers/import')).toBe(true);
    expect(isAdminPath('/')).toBe(false);
  });

  it('detects user paths', () => {
    expect(isUserPath('/')).toBe(true);
    expect(isUserPath('/profile')).toBe(true);
    expect(isAdminPath('/admin')).toBe(true);
    expect(isUserPath('/admin')).toBe(false);
  });

  it('returns role home paths', () => {
    expect(getRoleHomePath(UserRole.Admin)).toBe('/admin');
    expect(getRoleHomePath(UserRole.User)).toBe('/');
  });

  it('allows only matching paths per role', () => {
    expect(isPathAllowedForRole('/admin', UserRole.Admin)).toBe(true);
    expect(isPathAllowedForRole('/customers', UserRole.Admin)).toBe(true);
    expect(isPathAllowedForRole('/', UserRole.Admin)).toBe(false);
    expect(isPathAllowedForRole('/', UserRole.User)).toBe(true);
    expect(isPathAllowedForRole('/admin', UserRole.User)).toBe(false);
    expect(isPathAllowedForRole('/customers', UserRole.User)).toBe(false);
  });
});
