import { Global, Module } from '@nestjs/common';
import {
  BANKING_API_CONFIG,
  buildBankingApiConfig,
} from './banking-api.config';
import { BankingApiService } from './banking-api.service';

@Global()
@Module({
  providers: [
    {
      provide: BANKING_API_CONFIG,
      useFactory: buildBankingApiConfig,
    },
    BankingApiService,
  ],
  exports: [BankingApiService],
})
export class BankingApiModule {}
