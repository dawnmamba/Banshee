import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { TransactionImportPanel } from './TransactionImportPanel';
import * as api from '@/lib/api';

vi.mock('@/lib/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api')>();
  return {
    ...actual,
    importTransactionHistory: vi.fn(),
  };
});

const SAMPLE_PAYLOAD = {
  TransactionHistoryInquiryResponses: [
    {
      CustomerId: 'CUS0001',
      TransactionHistoryInquiryResponse: {
        Status: {
          Transaction_Reference: 'REF1',
          Timestamp: '2026-05-16T22:11:43.338Z',
          Code: '0000',
          Message: null,
          Description: null,
        },
        AccountSummary: {
          Account_branch: '0640',
          Account_basic_number: 'XA114D',
          Account_suffix: '001',
          Account_short_name: 'VOXVERSE STUDIO',
          Customer_mnemonic: 'XA114D',
          Account_type: 'CA',
          Currency_mnemonic: 'LKR',
          Available_balance: '10050000.00',
        },
        Transaction: [],
      },
    },
  ],
};

describe('TransactionImportPanel', () => {
  const onImported = vi.fn();

  beforeEach(() => {
    onImported.mockClear();
    vi.mocked(api.importTransactionHistory).mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('imports JSON file and shows success message', async () => {
    const user = userEvent.setup();
    vi.mocked(api.importTransactionHistory).mockResolvedValue({
      customerCount: 1,
      transactionCount: 0,
    });

    renderWithProviders(
      <TransactionImportPanel onImported={onImported} />,
    );

    const file = new File(
      [JSON.stringify(SAMPLE_PAYLOAD)],
      'inquiry.json',
      { type: 'application/json' },
    );
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    await user.upload(input, file);
    await user.click(screen.getByRole('button', { name: /import json/i }));

    await waitFor(() => {
      expect(api.importTransactionHistory).toHaveBeenCalledWith(SAMPLE_PAYLOAD);
      expect(
        screen.getByText(/imported 1 customers and 0 transactions/i),
      ).toBeInTheDocument();
      expect(onImported).toHaveBeenCalled();
    });
  });
});
