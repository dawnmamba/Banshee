import { cleanup, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { setAuthToken } from '@/lib/auth';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setAuthToken('test-token');
  });

  afterEach(() => {
    cleanup();
  });

  it('shows welcome and balance banner', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes('/auth/me')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              id: '1',
              email: 'a@b.com',
              firstName: 'Jane',
              lastName: 'Doe',
            }),
          });
        }
        if (url.includes('/account/balance')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              formattedBalance: 'LKR 100,500.00',
              currency: 'LKR',
              ledgerBalance: '10050000',
            }),
          });
        }
        return Promise.resolve({ ok: false, status: 404, text: async () => '' });
      }),
    );

    renderWithProviders(<HomePage />);

    expect(await screen.findByText(/welcome, jane/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/your account balance is/i),
    ).toBeInTheDocument();
  });
});
