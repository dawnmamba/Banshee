import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { UserAuthModule } from './user-auth/user-auth.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { WelcomeMessageModule } from './welcome-message/welcome-message.module';
import { BankingApiModule } from './banking-api/banking-api.module';
import { AccountBalanceModule } from './account-balance/account-balance.module';
import { AdminModule } from './admin/admin.module';
import { TransactionHistoryModule } from './transaction-history/transaction-history.module';

@Module({
  imports: [
    DatabaseModule,
    HealthModule,
    BankingApiModule,
    UserAuthModule,
    AdminModule,
    UserProfileModule,
    WelcomeMessageModule,
    AccountBalanceModule,
    TransactionHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
