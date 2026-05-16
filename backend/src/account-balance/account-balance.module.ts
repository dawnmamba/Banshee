import { Module } from '@nestjs/common';
import { BankingApiModule } from '../banking-api/banking-api.module';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { AccountBalanceController } from './account-balance.controller';
import { AccountBalanceService } from './account-balance.service';

@Module({
  imports: [BankingApiModule, UserProfileModule],
  controllers: [AccountBalanceController],
  providers: [AccountBalanceService],
})
export class AccountBalanceModule {}
