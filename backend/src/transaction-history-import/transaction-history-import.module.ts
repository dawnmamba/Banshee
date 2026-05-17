import { Module } from '@nestjs/common';
import { FraudDetectionModule } from '../fraud-detection/fraud-detection.module';
import { UserAuthModule } from '../user-auth/user-auth.module';
import { TransactionHistoryImportController } from './transaction-history-import.controller';
import { TransactionHistoryImportService } from './transaction-history-import.service';

@Module({
  imports: [UserAuthModule, FraudDetectionModule],
  controllers: [TransactionHistoryImportController],
  providers: [TransactionHistoryImportService],
})
export class TransactionHistoryImportModule {}
