import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ImportedCustomer } from './imported-customer.entity';

@Entity('imported_account_summaries')
export class ImportedAccountSummary {
  @PrimaryColumn({ name: 'customer_id', type: 'varchar' })
  customerId!: string;

  @OneToOne(() => ImportedCustomer, (customer) => customer.accountSummary, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer!: ImportedCustomer;

  @Column({ name: 'account_branch', type: 'varchar' })
  accountBranch!: string;

  @Column({ name: 'account_basic_number', type: 'varchar' })
  accountBasicNumber!: string;

  @Column({ name: 'account_suffix', type: 'varchar' })
  accountSuffix!: string;

  @Column({ name: 'account_short_name', type: 'varchar' })
  accountShortName!: string;

  @Column({ name: 'customer_mnemonic', type: 'varchar' })
  customerMnemonic!: string;

  @Column({ name: 'account_type', type: 'varchar' })
  accountType!: string;

  @Column({ name: 'currency_mnemonic', type: 'varchar' })
  currencyMnemonic!: string;

  @Column({
    name: 'available_balance',
    type: 'decimal',
    precision: 18,
    scale: 2,
  })
  availableBalance!: string;
}
