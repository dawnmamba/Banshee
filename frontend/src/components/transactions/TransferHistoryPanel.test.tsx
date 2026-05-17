import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { TransferHistoryPanel } from './TransferHistoryPanel';

vi.mock('@/lib/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api')>();
  return {
    ...actual,
    fetchTransactionHistory: vi.fn(),
  };
});

import { fetchTransactionHistory, TransactionHistoryError } from '@/lib/api';

const mockFetchTransactionHistory = vi.mocked(fetchTransactionHistory);

const sampleResponse = {
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

describe('TransferHistoryPanel', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mockFetchTransactionHistory.mockReset();
    mockFetchTransactionHistory.mockResolvedValue(sampleResponse);
  });

  it('renders transaction banners from API', async () => {
    renderWithProviders(<TransferHistoryPanel />);

    expect(
      await screen.findByText(/transfer - debit · test001/i),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('transfer-history-banner')).toHaveLength(1);
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
  });

  it('refetches when Search is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TransferHistoryPanel />);

    await screen.findByText(/transfer - debit · test001/i);
    mockFetchTransactionHistory.mockClear();

    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(mockFetchTransactionHistory).toHaveBeenCalled();
    });
  });

  it('shows profile link when account number is missing', async () => {
    mockFetchTransactionHistory.mockRejectedValue(
      new TransactionHistoryError(
        'Add your account number in Profile to view transaction history.',
        'missing_account',
      ),
    );

    renderWithProviders(<TransferHistoryPanel />);

    const link = await screen.findByRole('link', { name: /go to profile/i });
    expect(link).toHaveAttribute('href', '/profile');
  });
});
