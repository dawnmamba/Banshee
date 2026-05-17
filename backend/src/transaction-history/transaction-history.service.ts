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
import { buildTransactionHistoryPath } from './build-transaction-history-path';
import { mapTransactionHistoryResponse } from './map-transaction-history';
import type {
  TransactionHistoryInquiryResponse,
  TransactionHistoryResponseDto,
} from './transaction-history.types';

const MISSING_ACCOUNT_MESSAGE =
  'Add your account number in Profile to view transaction history.';

const HISTORY_UNAVAILABLE_MESSAGE =
  'Unable to retrieve transaction history. Please try again.';

const INVALID_DATE_RANGE_MESSAGE = 'Start date must be on or before end date.';

@Injectable()
export class TransactionHistoryService {
  constructor(
    private readonly bankingApi: BankingApiService,
    private readonly userProfileService: UserProfileService,
  ) {}

  async getHistory(
    userId: string,
    query: { startDate: string; endDate: string },
  ): Promise<TransactionHistoryResponseDto> {
    if (query.startDate > query.endDate) {
      throw new BadRequestException(INVALID_DATE_RANGE_MESSAGE);
    }

    const profile = await this.userProfileService.getProfile(userId);
    const accountNumber = profile.accountNumber?.trim();

    if (!accountNumber) {
      throw new BadRequestException(MISSING_ACCOUNT_MESSAGE);
    }

    try {
      const inquiry =
        await this.bankingApi.request<TransactionHistoryInquiryResponse>(
          buildTransactionHistoryPath(
            accountNumber,
            query.startDate,
            query.endDate,
          ),
        );

      const { Status } = inquiry.TransactionHistoryInquiryResponse;

      if (Status.Code !== '0000') {
        throw new BadGatewayException(
          Status.Message?.trim() || HISTORY_UNAVAILABLE_MESSAGE,
        );
      }

      return mapTransactionHistoryResponse(inquiry);
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof BadGatewayException
      ) {
        throw err;
      }
      if (err instanceof BankingApiError) {
        throw new BadGatewayException(
          err.message || HISTORY_UNAVAILABLE_MESSAGE,
        );
      }
      throw new BadGatewayException(HISTORY_UNAVAILABLE_MESSAGE);
    }
  }
}
