'use client';

import { PrimeReactProvider } from 'primereact/api';
import { authPt } from '@/lib/primereact/auth-pt';

export function PrimeProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrimeReactProvider value={{ unstyled: true, pt: authPt }}>
      {children}
    </PrimeReactProvider>
  );
}
