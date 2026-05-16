'use client';

import { PrimeReactProvider } from 'primereact/api';
import { ThemeProvider } from './ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrimeReactProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </PrimeReactProvider>
  );
}
