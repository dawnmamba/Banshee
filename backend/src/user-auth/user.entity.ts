import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from './user-role';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column({ type: 'varchar', default: UserRole.User })
  role!: UserRole;

  @Column({ name: 'account_number', type: 'varchar', nullable: true })
  accountNumber!: string | null;

  @Column({ type: 'varchar', nullable: true })
  nic!: string | null;

  @Column({ type: 'varchar', nullable: true })
  address!: string | null;

  @Column({ type: 'varchar', nullable: true })
  mobile!: string | null;

  @Column({ type: 'varchar', nullable: true })
  landline!: string | null;

  @Column({ name: 'secondary_email', type: 'varchar', nullable: true })
  secondaryEmail!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
