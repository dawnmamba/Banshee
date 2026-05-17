import { Test, TestingModule } from '@nestjs/testing';
import { FraudDetectionService } from '../fraud-detection/fraud-detection.service';
import { TransactionHistoryImportController } from './transaction-history-import.controller';
import { TransactionHistoryImportService } from './transaction-history-import.service';

describe('TransactionHistoryImportController', () => {
  let controller: TransactionHistoryImportController;
  let importService: {
    importFromPayload: jest.Mock;
    getSummary: jest.Mock;
    getTransactions: jest.Mock;
  };
  let fraudDetectionService: { analyze: jest.Mock };

  beforeEach(async () => {
    importService = {
      importFromPayload: jest.fn().mockResolvedValue({
        customerCount: 1,
        transactionCount: 2,
      }),
      getSummary: jest.fn().mockResolvedValue([]),
      getTransactions: jest.fn().mockResolvedValue([]),
    };
    fraudDetectionService = {
      analyze: jest.fn().mockResolvedValue({
        riskLevel: 'low',
        fraudDetected: false,
        flaggedCustomers: [],
        narrative: 'No issues found.',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionHistoryImportController],
      providers: [
        {
          provide: TransactionHistoryImportService,
          useValue: importService,
        },
        {
          provide: FraudDetectionService,
          useValue: fraudDetectionService,
        },
      ],
    }).compile();

    controller = module.get(TransactionHistoryImportController);
  });

  it('delegates import to service', async () => {
    const payload = { TransactionHistoryInquiryResponses: [] };
    const result = await controller.import(payload);

    expect(importService.importFromPayload).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ customerCount: 1, transactionCount: 2 });
  });

  it('delegates summary to service', async () => {
    await controller.getSummary();
    expect(importService.getSummary).toHaveBeenCalled();
  });

  it('delegates transactions to service', async () => {
    await controller.getTransactions('CUS0001');
    expect(importService.getTransactions).toHaveBeenCalledWith('CUS0001');
  });

  it('delegates fraud analysis to fraud detection service', async () => {
    const result = await controller.analyzeFraud();

    expect(fraudDetectionService.analyze).toHaveBeenCalled();
    expect(result).toEqual({
      riskLevel: 'low',
      fraudDetected: false,
      flaggedCustomers: [],
      narrative: 'No issues found.',
    });
  });
});
