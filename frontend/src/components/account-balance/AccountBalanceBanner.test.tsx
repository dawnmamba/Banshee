import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { AccountBalanceBanner } from './AccountBalanceBanner';

describe('AccountBalanceBanner', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows formatted balance after load', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          formattedBalance: 'LKR 100,500.00',
          currency: 'LKR',
          ledgerBalance: '10050000',
        }),
      }),
    );

    renderWithProviders(<AccountBalanceBanner />);

    expect(
      await screen.findByText(/your account balance is/i),
    ).toBeInTheDocument();
    expect(await screen.findByText('LKR 100,500.00')).toBeInTheDocument();
  });

  it('links to profile when account number is missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: async () =>
          JSON.stringify({
            statusCode: 400,
            message:
              'Add your account number in Profile to view your balance.',
          }),
      }),
    );

    renderWithProviders(<AccountBalanceBanner />);

    const link = await screen.findByRole('link', { name: /profile/i });
    expect(link).toHaveAttribute('href', '/profile');
    expect(
      screen.getByText(/add your account number in profile/i),
    ).toBeInTheDocument();
  });

  it('shows error with retry on API failure', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 502,
        text: async () =>
          JSON.stringify({
            statusCode: 502,
            message: 'Unable to retrieve account balance. Please try again.',
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          formattedBalance: 'LKR 50.00',
          currency: 'LKR',
          ledgerBalance: '5000',
        }),
      });

    vi.stubGlobal('fetch', fetchMock);

    const user = userEvent.setup();
    renderWithProviders(<AccountBalanceBanner />);

    expect(
      await screen.findByText(/unable to retrieve account balance/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /retry/i }));

    expect(await screen.findByText('LKR 50.00')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
