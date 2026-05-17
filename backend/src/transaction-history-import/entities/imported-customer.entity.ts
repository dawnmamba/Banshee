import { Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { ImportedAccountSummary } from './imported-account-summary.entity';
import { ImportedBankTransaction } from './imported-bank-transaction.entity';
import { ImportedInquiryStatus } from './imported-inquiry-status.entity';

@Entity('imported_customers')
export class ImportedCustomer {
  @PrimaryColumn({ name: 'customer_id', type: 'varchar' })
  customerId!: string;

  @OneToOne(() => ImportedInquiryStatus, (status) => status.customer, {
    cascade: true,
  })
  inquiryStatus!: ImportedInquiryStatus;

  @OneToOne(() => ImportedAccountSummary, (summary) => summary.customer, {
    cascade: true,
  })
  accountSummary!: ImportedAccountSummary;

  @OneToMany(() => ImportedBankTransaction, (tx) => tx.customer, {
    cascade: true,
  })
  transactions!: ImportedBankTransaction[];
}
