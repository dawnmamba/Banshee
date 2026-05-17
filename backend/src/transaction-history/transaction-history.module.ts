import { Module } from '@nestjs/common';
import { BankingApiModule } from '../banking-api/banking-api.module';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { TransactionHistoryController } from './transaction-history.controller';
import { TransactionHistoryService } from './transaction-history.service';

@Module({
  imports: [BankingApiModule, UserProfileModule],
  controllers: [TransactionHistoryController],
  providers: [TransactionHistoryService],
})
export class TransactionHistoryModule {}
