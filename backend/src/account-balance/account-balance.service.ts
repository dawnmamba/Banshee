import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import {
  BankingApiError,
  BankingApiService,
} from '../banking-api/banking-api.service';
import { UserProfileService } from '../user-profile/user-profile.service';
import type {
  AccountBalanceDto,
  AccountBalanceInquiryResponse,
} from './account-balance.types';
import {
  buildBalanceInquiryPath,
  formatLedgerBalance,
} from './format-ledger-balance';

const MISSING_ACCOUNT_MESSAGE =
  'Add your account number in Profile to view your balance.';

const BALANCE_UNAVAILABLE_MESSAGE =
  'Unable to retrieve account balance. Please try again.';

@Injectable()
export class AccountBalanceService {
  constructor(
    private readonly bankingApi: BankingApiService,
    private readonly userProfileService: UserProfileService,
  ) {}

  async getBalance(userId: string): Promise<AccountBalanceDto> {
    const profile = await this.userProfileService.getProfile(userId);
    const accountNumber = profile.accountNumber?.trim();

    if (!accountNumber) {
      throw new BadRequestException(MISSING_ACCOUNT_MESSAGE);
    }

    try {
      const inquiry =
        await this.bankingApi.request<AccountBalanceInquiryResponse>(
          buildBalanceInquiryPath(accountNumber),
        );

      const { Status, Account } = inquiry.Account_Balance_Inquiry;

      if (Status.Code !== '0000') {
        throw new BadGatewayException(
          Status.Message?.trim() || BALANCE_UNAVAILABLE_MESSAGE,
        );
      }

      const currency = Account.Currency_mnemonic || 'LKR';
      const ledgerBalance = Account.Ledger_balance;

      return {
        formattedBalance: formatLedgerBalance(ledgerBalance, currency),
        currency,
        ledgerBalance,
      };
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof BadGatewayException
      ) {
        throw err;
      }
      if (err instanceof BankingApiError) {
        throw new BadGatewayException(
          err.message || BALANCE_UNAVAILABLE_MESSAGE,
        );
      }
      throw new BadGatewayException(BALANCE_UNAVAILABLE_MESSAGE);
    }
  }
}
