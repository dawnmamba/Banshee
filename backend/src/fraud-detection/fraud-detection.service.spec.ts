import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { ImportedCustomer } from '../transaction-history-import/entities/imported-customer.entity';
import type {
  FraudAnalysisPayload,
  FraudAnalysisResultDto,
} from './fraud-detection.types';
import { FraudDetectionService } from './fraud-detection.service';
import { AzureAiFoundryService } from './azure-ai-foundry.service';

describe('FraudDetectionService', () => {
  let service: FraudDetectionService;
  let customerRepo: { find: jest.Mock };
  let azureAiFoundryService: {
    analyzeFraud: jest.MockedFunction<
      (payload: FraudAnalysisPayload) => Promise<FraudAnalysisResultDto>
    >;
  };

  const sampleCustomer = {
    customerId: 'CUS0001',
    inquiryStatus: {
      transactionReference: 'REF1',
      inquiryTimestamp: new Date('2026-05-16T22:11:43.338Z'),
      code: '0000',
      message: null,
      description: null,
    },
    accountSummary: {
      accountBranch: '0640',
      accountBasicNumber: 'XA114D',
      accountSuffix: '001',
      accountShortName: 'VOXVERSE STUDIO',
      customerMnemonic: 'XA114D',
      accountType: 'CA',
      currencyMnemonic: 'LKR',
      availableBalance: '10050000.00',
    },
    transactions: [
      {
        uniqueKey: 'SHOTPEI2605120000001',
        postingDate: '2026-05-12',
        transactionCodeName: 'TRANSFER - CREDIT',
        postingAmount: '50000.00',
        runningBalance: '50000.00',
      },
    ],
  } as ImportedCustomer;

  beforeEach(async () => {
    customerRepo = { find: jest.fn() };
    azureAiFoundryService = {
      analyzeFraud: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FraudDetectionService,
        {
          provide: DataSource,
          useValue: {
            getRepository: jest.fn().mockReturnValue(customerRepo),
          },
        },
        {
          provide: AzureAiFoundryService,
          useValue: azureAiFoundryService,
        },
      ],
    }).compile();

    service = module.get(FraudDetectionService);
  });

  it('analyze() throws BadRequest when no customers', async () => {
    customerRepo.find.mockResolvedValue([]);

    await expect(service.analyze()).rejects.toBeInstanceOf(BadRequestException);
    expect(azureAiFoundryService.analyzeFraud).not.toHaveBeenCalled();
  });

  it('analyze() calls Azure AI Foundry with customer payload and returns parsed result', async () => {
    customerRepo.find.mockResolvedValue([sampleCustomer]);
    azureAiFoundryService.analyzeFraud.mockResolvedValue({
      riskLevel: 'high',
      fraudDetected: true,
      flaggedCustomers: [
        { customerId: 'CUS0001', reason: 'Unusual large credit' },
      ],
      narrative: 'Customer CUS0001 shows a large inbound transfer.',
    });

    const result = await service.analyze();

    expect(azureAiFoundryService.analyzeFraud).toHaveBeenCalledTimes(1);
    const firstCall = azureAiFoundryService.analyzeFraud.mock.calls.at(0);
    const payload = firstCall?.[0] as FraudAnalysisPayload;
    expect(payload.customers[0]?.customerId).toBe('CUS0001');
    expect(payload.customers[0]?.transactions[0]?.uniqueKey).toBe(
      'SHOTPEI2605120000001',
    );
    expect(result).toEqual({
      riskLevel: 'high',
      fraudDetected: true,
      flaggedCustomers: [
        { customerId: 'CUS0001', reason: 'Unusual large credit' },
      ],
      narrative: 'Customer CUS0001 shows a large inbound transfer.',
    });
  });
});
