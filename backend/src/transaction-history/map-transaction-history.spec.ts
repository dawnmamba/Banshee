import { mapTransactionHistoryResponse } from './map-transaction-history';

const sampleResponse = {
  TransactionHistoryInquiryResponse: {
    Status: { Code: '0000', Message: null },
    AccountSummary: {
      Date_from: '2020-12-09',
      Date_to: '2021-03-09',
    },
    Transaction: [
      {
        Posting_date: '2021-02-16',
        Posting_currency: 'LKR',
        Transaction_Code_Name: 'TRANSFER - DEBIT',
        Posting_amount: '-100.00',
        Transaction_Status: 'D',
        Users_own_reference: 'TEST001',
        Narrative_4: 'E210216225125$$AA0000006409366',
        Posting_sequence_number: '0000015',
        Event_key: '12102168276330000001',
      },
    ],
  },
};

describe('mapTransactionHistoryResponse', () => {
  it('maps transactions to DTO items', () => {
    const result = mapTransactionHistoryResponse(sampleResponse);

    expect(result.dateFrom).toBe('2020-12-09');
    expect(result.dateTo).toBe('2021-03-09');
    expect(result.transactions).toHaveLength(1);
    expect(result.transactions[0]).toMatchObject({
      id: '12102168276330000001-0000015',
      postingDate: '2021-02-16',
      currency: 'LKR',
      transactionName: 'TRANSFER - DEBIT',
      reference: 'TEST001',
      isDebit: true,
    });
    expect(result.transactions[0].formattedAmount).toMatch(/100/);
    expect(result.transactions[0].statusLabel).toBe('Posted');
  });

  it('wraps a single transaction object into an array', () => {
    const single = {
      TransactionHistoryInquiryResponse: {
        Status: { Code: '0000', Message: null },
        AccountSummary: { Date_from: '2021-01-01', Date_to: '2021-01-01' },
        Transaction:
          sampleResponse.TransactionHistoryInquiryResponse.Transaction[0],
      },
    };

    expect(mapTransactionHistoryResponse(single).transactions).toHaveLength(1);
  });

  it('returns empty transactions when none are present', () => {
    const empty = {
      TransactionHistoryInquiryResponse: {
        Status: { Code: '0000', Message: null },
        AccountSummary: { Date_from: '2021-01-01', Date_to: '2021-01-01' },
      },
    };

    expect(mapTransactionHistoryResponse(empty).transactions).toEqual([]);
  });
});
