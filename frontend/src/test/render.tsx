import { render, type RenderOptions } from '@testing-library/react';
import { PrimeProvider } from '@/components/PrimeProvider';

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, {
    wrapper: ({ children }) => <PrimeProvider>{children}</PrimeProvider>,
    ...options,
  });
}
