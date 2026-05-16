'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  applyThemeToDocument,
  getThemePreference,
  resolveTheme,
  setThemePreference,
  type ThemePreference,
} from '@/lib/theme';

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read localStorage after mount to avoid SSR/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client-only init
    setPreferenceState(getThemePreference());
    setMounted(true);
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setThemePreference(next);
    setPreferenceState(next);
    applyThemeToDocument(resolveTheme(next));
  }, []);

  useLayoutEffect(() => {
    if (!mounted) {
      return;
    }
    applyThemeToDocument(resolveTheme(preference));
  }, [preference, mounted]);

  useEffect(() => {
    if (!mounted || preference !== 'system') {
      return;
    }

    if (typeof window.matchMedia !== 'function') {
      return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      applyThemeToDocument(resolveTheme('system'));
    };

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [preference, mounted]);

  const value = useMemo(
    () => ({ preference, setPreference }),
    [preference, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
