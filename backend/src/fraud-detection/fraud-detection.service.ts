import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ImportedCustomer } from '../transaction-history-import/entities/imported-customer.entity';
import type {
  FraudAnalysisPayload,
  FraudAnalysisResultDto,
} from './fraud-detection.types';
import { AzureAiFoundryService } from './azure-ai-foundry.service';

@Injectable()
export class FraudDetectionService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly azureAiFoundryService: AzureAiFoundryService,
  ) {}

  async analyze(): Promise<FraudAnalysisResultDto> {
    const customers = await this.dataSource
      .getRepository(ImportedCustomer)
      .find({
        relations: ['inquiryStatus', 'accountSummary', 'transactions'],
        order: { customerId: 'ASC' },
      });

    if (customers.length === 0) {
      throw new BadRequestException('No imported customers to analyze');
    }

    const payload = this.buildPayload(customers);
    return this.azureAiFoundryService.analyzeFraud(payload);
  }

  buildPayload(customers: ImportedCustomer[]): FraudAnalysisPayload {
    return {
      customers: customers.map((customer) => ({
        customerId: customer.customerId,
        inquiryStatus: {
          transactionReference: customer.inquiryStatus.transactionReference,
          inquiryTimestamp:
            customer.inquiryStatus.inquiryTimestamp.toISOString(),
          code: customer.inquiryStatus.code,
          message: customer.inquiryStatus.message,
          description: customer.inquiryStatus.description,
        },
        accountSummary: {
          accountBranch: customer.accountSummary.accountBranch,
          accountBasicNumber: customer.accountSummary.accountBasicNumber,
          accountSuffix: customer.accountSummary.accountSuffix,
          accountShortName: customer.accountSummary.accountShortName,
          customerMnemonic: customer.accountSummary.customerMnemonic,
          accountType: customer.accountSummary.accountType,
          currencyMnemonic: customer.accountSummary.currencyMnemonic,
          availableBalance: String(customer.accountSummary.availableBalance),
        },
        transactions: [...customer.transactions]
          .sort((a, b) => b.postingDate.localeCompare(a.postingDate))
          .map((tx) => ({
            uniqueKey: tx.uniqueKey,
            postingDate: tx.postingDate,
            transactionCodeName: tx.transactionCodeName,
            postingAmount: String(tx.postingAmount),
            runningBalance: String(tx.runningBalance),
          })),
      })),
    };
  }
}
