import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';
import { ImportedAccountSummary } from './entities/imported-account-summary.entity';
import { ImportedBankTransaction } from './entities/imported-bank-transaction.entity';
import { ImportedCustomer } from './entities/imported-customer.entity';
import { ImportedInquiryStatus } from './entities/imported-inquiry-status.entity';
import { TransactionHistoryImportService } from './transaction-history-import.service';

const PARSED_PAYLOAD = {
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
          {
            Posting_date: '2026-05-13',
            Transaction_Code_Name: 'ATM WITHDRAWAL',
            Posting_amount: '-5000.00',
            Running_balance: '10045000.00',
            Unique_key: 'ATM2605130000001',
          },
        ],
      },
    },
  ],
};

describe('TransactionHistoryImportService', () => {
  let service: TransactionHistoryImportService;
  let manager: {
    delete: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    count: jest.Mock;
    createQueryBuilder: jest.Mock;
  };
  let customerRepo: { find: jest.Mock; findOne: jest.Mock };
  let transactionRepo: { find: jest.Mock };
  let transactionFn: jest.Mock;

  beforeEach(async () => {
    manager = {
      delete: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(undefined),
      find: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    customerRepo = { find: jest.fn(), findOne: jest.fn() };
    transactionRepo = { find: jest.fn() };

    transactionFn = jest.fn(
      async (work: (em: EntityManager) => Promise<unknown>) =>
        work(manager as unknown as EntityManager),
    );

    const dataSource = {
      transaction: transactionFn,
      getRepository: jest.fn((entity: unknown) => {
        if (entity === ImportedCustomer) {
          return customerRepo;
        }
        if (entity === ImportedBankTransaction) {
          return transactionRepo;
        }
        throw new Error('Unexpected entity');
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionHistoryImportService,
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get(TransactionHistoryImportService);
    jest.clearAllMocks();
  });

  describe('importFromPayload', () => {
    it('clears import tables then inserts customers and transactions', async () => {
      const result = await service.importFromPayload(PARSED_PAYLOAD);

      expect(transactionFn).toHaveBeenCalled();
      expect(manager.delete).toHaveBeenCalledWith(ImportedBankTransaction, {});
      expect(manager.delete).toHaveBeenCalledWith(ImportedInquiryStatus, {});
      expect(manager.delete).toHaveBeenCalledWith(ImportedAccountSummary, {});
      expect(manager.delete).toHaveBeenCalledWith(ImportedCustomer, {});
      expect(manager.save).toHaveBeenCalledWith(
        ImportedCustomer,
        expect.arrayContaining([
          expect.objectContaining({ customerId: 'CUS0001' }),
        ]),
      );
      expect(manager.save).toHaveBeenCalledWith(
        ImportedBankTransaction,
        expect.arrayContaining([
          expect.objectContaining({ uniqueKey: 'SHOTPEI2605120000001' }),
          expect.objectContaining({ uniqueKey: 'ATM2605130000001' }),
        ]),
      );
      expect(result).toEqual({ customerCount: 1, transactionCount: 2 });
    });
  });

  describe('getSummary', () => {
    it('returns account fields and transaction counts per customer', async () => {
      customerRepo.find.mockResolvedValue([
        {
          customerId: 'CUS0001',
          accountSummary: {
            accountShortName: 'VOXVERSE STUDIO',
            accountBranch: '0640',
            currencyMnemonic: 'LKR',
            availableBalance: '10050000.00',
          },
          transactions: [{}, {}],
        },
      ]);

      const summary = await service.getSummary();

      expect(summary).toEqual([
        {
          customerId: 'CUS0001',
          accountShortName: 'VOXVERSE STUDIO',
          accountBranch: '0640',
          currency: 'LKR',
          availableBalance: '10050000.00',
          transactionCount: 2,
        },
      ]);
    });
  });

  describe('getTransactions', () => {
    it('returns transactions for a customer ordered by posting date desc', async () => {
      customerRepo.findOne.mockResolvedValue({ customerId: 'CUS0001' });
      transactionRepo.find.mockResolvedValue([
        {
          uniqueKey: 'ATM2605130000001',
          postingDate: '2026-05-13',
          transactionCodeName: 'ATM WITHDRAWAL',
          postingAmount: '-5000.00',
          runningBalance: '10045000.00',
        },
        {
          uniqueKey: 'SHOTPEI2605120000001',
          postingDate: '2026-05-12',
          transactionCodeName: 'TRANSFER - CREDIT',
          postingAmount: '50000.00',
          runningBalance: '50000.00',
        },
      ]);

      const rows = await service.getTransactions('CUS0001');

      expect(transactionRepo.find).toHaveBeenCalledWith({
        where: { customerId: 'CUS0001' },
        order: { postingDate: 'DESC', uniqueKey: 'DESC' },
      });
      expect(rows[0].uniqueKey).toBe('ATM2605130000001');
    });

    it('throws when customer is not found', async () => {
      customerRepo.findOne.mockResolvedValue(null);

      await expect(service.getTransactions('MISSING')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
