import { render, type RenderOptions } from '@testing-library/react';
import { PrimeProvider } from '@/components/PrimeProvider';
import { ThemeProvider } from '@/components/user-profile-menu/ThemeProvider';

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <PrimeProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </PrimeProvider>
    ),
    ...options,
  });
}
