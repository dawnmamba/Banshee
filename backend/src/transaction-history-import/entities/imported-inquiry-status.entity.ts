import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ImportedCustomer } from './imported-customer.entity';

@Entity('imported_inquiry_statuses')
export class ImportedInquiryStatus {
  @PrimaryColumn({ name: 'customer_id', type: 'varchar' })
  customerId!: string;

  @OneToOne(() => ImportedCustomer, (customer) => customer.inquiryStatus, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer!: ImportedCustomer;

  @Column({ name: 'transaction_reference', type: 'varchar' })
  transactionReference!: string;

  @Column({ name: 'inquiry_timestamp', type: 'timestamptz' })
  inquiryTimestamp!: Date;

  @Column({ type: 'varchar' })
  code!: string;

  @Column({ type: 'varchar', nullable: true })
  message!: string | null;

  @Column({ type: 'varchar', nullable: true })
  description!: string | null;
}
