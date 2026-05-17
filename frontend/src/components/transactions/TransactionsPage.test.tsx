import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { TransactionsPage } from './TransactionsPage';

vi.mock('@/lib/api', () => ({
  fetchProfile: vi.fn(),
  fetchTransactionHistory: vi.fn(),
}));

import { fetchProfile, fetchTransactionHistory } from '@/lib/api';

const mockFetchProfile = vi.mocked(fetchProfile);
const mockFetchTransactionHistory = vi.mocked(fetchTransactionHistory);

const historyResponse = {
  dateFrom: '2021-01-01',
  dateTo: '2021-01-31',
  transactions: [
    {
      id: 'tx-1',
      postingDate: '2021-02-16',
      displayDate: 'Feb 16, 2021',
      formattedAmount: 'LKR 100.00',
      currency: 'LKR',
      transactionName: 'TRANSFER - DEBIT',
      statusLabel: 'Posted',
      reference: 'TEST001',
      summary: 'TRANSFER - DEBIT · TEST001',
      isDebit: true,
    },
  ],
};

const profileWithAccount = {
  id: '1',
  email: 'a@b.com',
  firstName: 'Ada',
  lastName: 'Lovelace',
  accountNumber: '1234567890',
  nic: null,
  address: null,
  mobile: null,
  landline: null,
  secondaryEmail: null,
};

const profileWithoutAccount = {
  ...profileWithAccount,
  accountNumber: null,
};

describe('TransactionsPage', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mockFetchProfile.mockReset();
    mockFetchTransactionHistory.mockReset();
    mockFetchTransactionHistory.mockResolvedValue(historyResponse);
  });

  it('renders title and Transfer panel by default when account exists', async () => {
    mockFetchProfile.mockResolvedValue(profileWithAccount);

    renderWithProviders(<TransactionsPage />);

    expect(
      await screen.findByRole('heading', { name: 'Transactions' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Transfer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'History' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Internal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'External' })).toBeInTheDocument();
    expect(screen.getByLabelText(/to account number/i)).toBeInTheDocument();
  });

  it('switches to History panel when that tab is selected', async () => {
    mockFetchProfile.mockResolvedValue(profileWithAccount);
    const user = userEvent.setup();

    renderWithProviders(<TransactionsPage />);
    await screen.findByRole('heading', { name: 'Transactions' });

    await user.click(screen.getByRole('button', { name: 'History' }));

    expect(
      await screen.findAllByTestId('transfer-history-banner'),
    ).toHaveLength(1);
    expect(screen.getByText(/transfer - debit · test001/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Internal' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/to account number/i)).not.toBeInTheDocument();
  });

  it('shows external form when External transfer type is selected', async () => {
    mockFetchProfile.mockResolvedValue(profileWithAccount);
    const user = userEvent.setup();

    renderWithProviders(<TransactionsPage />);
    await screen.findByRole('heading', { name: 'Transactions' });

    await user.click(screen.getByRole('button', { name: 'External' }));

    expect(screen.getByLabelText(/beneficiary name/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/to account number/i)).not.toBeInTheDocument();
  });

  it('shows Profile guidance when account number is missing', async () => {
    mockFetchProfile.mockResolvedValue(profileWithoutAccount);

    renderWithProviders(<TransactionsPage />);

    expect(
      await screen.findByText(/add your account number in profile/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to profile/i })).toHaveAttribute(
      'href',
      '/profile',
    );
    expect(
      screen.queryByRole('button', { name: 'Transfer' }),
    ).not.toBeInTheDocument();
  });

  it('shows tabs when account number is present', async () => {
    mockFetchProfile.mockResolvedValue(profileWithAccount);

    renderWithProviders(<TransactionsPage />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Transfer' }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByText(/add your account number in profile/i),
    ).not.toBeInTheDocument();
  });
});
