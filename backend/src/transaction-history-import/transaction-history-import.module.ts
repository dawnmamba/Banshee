import { Module } from '@nestjs/common';
import { UserAuthModule } from '../user-auth/user-auth.module';
import { TransactionHistoryImportController } from './transaction-history-import.controller';
import { TransactionHistoryImportService } from './transaction-history-import.service';

@Module({
  imports: [UserAuthModule],
  controllers: [TransactionHistoryImportController],
  providers: [TransactionHistoryImportService],
})
export class TransactionHistoryImportModule {}
