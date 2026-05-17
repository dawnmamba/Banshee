import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ImportedCustomer } from './imported-customer.entity';

@Entity('imported_bank_transactions')
export class ImportedBankTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'customer_id', type: 'varchar' })
  customerId!: string;

  @ManyToOne(() => ImportedCustomer, (customer) => customer.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer!: ImportedCustomer;

  @Column({ name: 'unique_key', type: 'varchar', unique: true })
  uniqueKey!: string;

  @Column({ name: 'posting_date', type: 'date' })
  postingDate!: string;

  @Column({ name: 'transaction_code_name', type: 'varchar' })
  transactionCodeName!: string;

  @Column({
    name: 'posting_amount',
    type: 'decimal',
    precision: 18,
    scale: 2,
  })
  postingAmount!: string;

  @Column({
    name: 'running_balance',
    type: 'decimal',
    precision: 18,
    scale: 2,
  })
  runningBalance!: string;
}
