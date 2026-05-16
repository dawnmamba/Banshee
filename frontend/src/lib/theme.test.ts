import { describe, it, expect, beforeEach } from 'vitest';
import {
  getThemePreference,
  setThemePreference,
  resolveTheme,
  THEME_STORAGE_KEY,
} from './theme';

describe('theme preference', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to system when unset', () => {
    expect(getThemePreference()).toBe('system');
  });

  it('persists preference in localStorage', () => {
    setThemePreference('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(getThemePreference()).toBe('dark');
  });

  it('resolveTheme returns light or dark', () => {
    expect(resolveTheme('light')).toBe('light');
    expect(resolveTheme('dark')).toBe('dark');
  });
});
