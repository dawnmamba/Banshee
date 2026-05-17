import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { CustomersPage } from './CustomersPage';
import * as api from '@/lib/api';

vi.mock('@/lib/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api')>();
  return {
    ...actual,
    fetchTransactionImportSummary: vi.fn(),
    fetchImportedCustomerTransactions: vi.fn(),
    importTransactionHistory: vi.fn(),
    runFraudAnalysis: vi.fn(),
  };
});

describe('CustomersPage', () => {
  beforeEach(() => {
    vi.mocked(api.fetchTransactionImportSummary).mockResolvedValue([
      {
        customerId: 'CUS0001',
        accountShortName: 'VOXVERSE STUDIO',
        accountBranch: '0640',
        currency: 'LKR',
        availableBalance: '10050000.00',
        transactionCount: 2,
      },
    ]);
    vi.mocked(api.fetchImportedCustomerTransactions).mockResolvedValue([]);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders summary table from API', async () => {
    renderWithProviders(<CustomersPage />);

    await waitFor(() => {
      expect(screen.getByText('CUS0001')).toBeInTheDocument();
      expect(screen.getByText('VOXVERSE STUDIO')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('shows Detect fraud when customers are loaded', async () => {
    renderWithProviders(<CustomersPage />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /detect fraud/i }),
      ).toBeEnabled();
    });
  });

  it('loads transactions when a customer row is selected', async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchImportedCustomerTransactions).mockResolvedValue([
      {
        uniqueKey: 'SHOTPEI2605120000001',
        postingDate: '2026-05-12',
        transactionCodeName: 'TRANSFER - CREDIT',
        postingAmount: '50000.00',
        runningBalance: '50000.00',
      },
    ]);

    renderWithProviders(<CustomersPage />);

    await waitFor(() => {
      expect(screen.getByText('CUS0001')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /view transactions for CUS0001/i }));

    await waitFor(() => {
      expect(api.fetchImportedCustomerTransactions).toHaveBeenCalledWith('CUS0001');
      expect(screen.getByText('TRANSFER - CREDIT')).toBeInTheDocument();
    });
  });
});
