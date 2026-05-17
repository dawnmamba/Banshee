import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { ImportedAccountSummary } from './entities/imported-account-summary.entity';
import { ImportedBankTransaction } from './entities/imported-bank-transaction.entity';
import { ImportedCustomer } from './entities/imported-customer.entity';
import { ImportedInquiryStatus } from './entities/imported-inquiry-status.entity';
import { parseImportPayload } from './parse-import-payload';

export type ImportResultDto = {
  customerCount: number;
  transactionCount: number;
};

export type ImportSummaryRowDto = {
  customerId: string;
  accountShortName: string;
  accountBranch: string;
  currency: string;
  availableBalance: string;
  transactionCount: number;
};

export type ImportedTransactionRowDto = {
  uniqueKey: string;
  postingDate: string;
  transactionCodeName: string;
  postingAmount: string;
  runningBalance: string;
};

const TRUNCATE_IMPORT_TABLES_SQL = `
  TRUNCATE TABLE
    imported_bank_transactions,
    imported_inquiry_statuses,
    imported_account_summaries,
    imported_customers
  RESTART IDENTITY CASCADE
`;

@Injectable()
export class TransactionHistoryImportService {
  constructor(private readonly dataSource: DataSource) {}

  async clearImportTables(manager: EntityManager): Promise<void> {
    await manager.query(TRUNCATE_IMPORT_TABLES_SQL);
  }

  async importFromPayload(payload: unknown): Promise<ImportResultDto> {
    const parsed = parseImportPayload(payload);

    return this.dataSource.transaction(async (manager) => {
      await this.clearImportTables(manager);

      const customers: ImportedCustomer[] = [];
      const statuses: ImportedInquiryStatus[] = [];
      const summaries: ImportedAccountSummary[] = [];
      const transactions: ImportedBankTransaction[] = [];

      for (const item of parsed) {
        customers.push({ customerId: item.customerId } as ImportedCustomer);

        statuses.push({
          customerId: item.customerId,
          transactionReference: item.status.transactionReference,
          inquiryTimestamp: new Date(item.status.timestamp),
          code: item.status.code,
          message: item.status.message,
          description: item.status.description,
        } as ImportedInquiryStatus);

        summaries.push({
          customerId: item.customerId,
          accountBranch: item.accountSummary.accountBranch,
          accountBasicNumber: item.accountSummary.accountBasicNumber,
          accountSuffix: item.accountSummary.accountSuffix,
          accountShortName: item.accountSummary.accountShortName,
          customerMnemonic: item.accountSummary.customerMnemonic,
          accountType: item.accountSummary.accountType,
          currencyMnemonic: item.accountSummary.currencyMnemonic,
          availableBalance: item.accountSummary.availableBalance,
        } as ImportedAccountSummary);

        for (const tx of item.transactions) {
          transactions.push({
            customerId: item.customerId,
            uniqueKey: tx.uniqueKey,
            postingDate: tx.postingDate,
            transactionCodeName: tx.transactionCodeName,
            postingAmount: tx.postingAmount,
            runningBalance: tx.runningBalance,
          } as ImportedBankTransaction);
        }
      }

      if (customers.length > 0) {
        await manager.save(ImportedCustomer, customers);
        await manager.save(ImportedInquiryStatus, statuses);
        await manager.save(ImportedAccountSummary, summaries);
      }

      if (transactions.length > 0) {
        await manager.save(ImportedBankTransaction, transactions);
      }

      return {
        customerCount: customers.length,
        transactionCount: transactions.length,
      };
    });
  }

  async getSummary(): Promise<ImportSummaryRowDto[]> {
    const customers = await this.dataSource
      .getRepository(ImportedCustomer)
      .find({
        relations: ['accountSummary', 'transactions'],
        order: { customerId: 'ASC' },
      });

    return customers.map((customer) => ({
      customerId: customer.customerId,
      accountShortName: customer.accountSummary.accountShortName,
      accountBranch: customer.accountSummary.accountBranch,
      currency: customer.accountSummary.currencyMnemonic,
      availableBalance: String(customer.accountSummary.availableBalance),
      transactionCount: customer.transactions.length,
    }));
  }

  async getTransactions(
    customerId: string,
  ): Promise<ImportedTransactionRowDto[]> {
    const customer = await this.dataSource
      .getRepository(ImportedCustomer)
      .findOne({ where: { customerId } });

    if (!customer) {
      throw new NotFoundException(`Customer ${customerId} not found`);
    }

    const rows = await this.dataSource
      .getRepository(ImportedBankTransaction)
      .find({
        where: { customerId },
        order: { postingDate: 'DESC', uniqueKey: 'DESC' },
      });

    return rows.map((row) => ({
      uniqueKey: row.uniqueKey,
      postingDate: row.postingDate,
      transactionCodeName: row.transactionCodeName,
      postingAmount: String(row.postingAmount),
      runningBalance: String(row.runningBalance),
    }));
  }
}
