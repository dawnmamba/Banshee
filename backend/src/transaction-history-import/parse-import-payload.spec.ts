import { BadRequestException } from '@nestjs/common';
import { parseImportPayload } from './parse-import-payload';

const SAMPLE = {
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
        Transaction: [
          {
            Posting_date: '2026-05-12',
            Transaction_Code_Name: 'TRANSFER - CREDIT',
            Posting_amount: '50000.00',
            Running_balance: '50000.00',
            Unique_key: 'SHOTPEI2605120000001',
          },
        ],
      },
    },
  ],
};

describe('parseImportPayload', () => {
  it('parses a valid inquiry envelope', () => {
    const result = parseImportPayload(SAMPLE);
    expect(result).toHaveLength(1);
    expect(result[0].customerId).toBe('CUS0001');
    expect(result[0].transactions).toHaveLength(1);
    expect(result[0].transactions[0].uniqueKey).toBe('SHOTPEI2605120000001');
  });

  it('normalizes a single Transaction object to an array', () => {
    const single = {
      ...SAMPLE,
      TransactionHistoryInquiryResponses: [
        {
          ...SAMPLE.TransactionHistoryInquiryResponses[0],
          TransactionHistoryInquiryResponse: {
            ...SAMPLE.TransactionHistoryInquiryResponses[0]
              .TransactionHistoryInquiryResponse,
            Transaction:
              SAMPLE.TransactionHistoryInquiryResponses[0]
                .TransactionHistoryInquiryResponse.Transaction[0],
          },
        },
      ],
    };
    const result = parseImportPayload(single);
    expect(result[0].transactions).toHaveLength(1);
  });

  it('throws when envelope is missing responses array', () => {
    expect(() => parseImportPayload({})).toThrow(BadRequestException);
  });

  it('throws when CustomerId is missing', () => {
    expect(() =>
      parseImportPayload({
        TransactionHistoryInquiryResponses: [
          {
            TransactionHistoryInquiryResponse:
              SAMPLE.TransactionHistoryInquiryResponses[0]
                .TransactionHistoryInquiryResponse,
          },
        ],
      }),
    ).toThrow(BadRequestException);
  });
});
