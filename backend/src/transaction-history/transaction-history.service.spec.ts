import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BankingApiError,
  BankingApiService,
} from '../banking-api/banking-api.service';
import { UserProfileService } from '../user-profile/user-profile.service';
import { TransactionHistoryService } from './transaction-history.service';

const sampleResponse = {
  TransactionHistoryInquiryResponse: {
    Status: { Code: '0000', Message: null },
    AccountSummary: {
      Date_from: '2021-01-01',
      Date_to: '2021-01-31',
    },
    Transaction: [],
  },
};

describe('TransactionHistoryService', () => {
  let service: TransactionHistoryService;
  let bankingApi: jest.Mocked<Pick<BankingApiService, 'request'>>;
  let userProfile: jest.Mocked<Pick<UserProfileService, 'getProfile'>>;

  beforeEach(async () => {
    bankingApi = { request: jest.fn() };
    userProfile = { getProfile: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionHistoryService,
        { provide: BankingApiService, useValue: bankingApi },
        { provide: UserProfileService, useValue: userProfile },
      ],
    }).compile();

    service = module.get(TransactionHistoryService);
  });

  const profileWithAccount = {
    id: 'user-1',
    email: 'a@b.com',
    firstName: 'Jane',
    lastName: 'Doe',
    accountNumber: '008000999999001',
    nic: null,
    address: null,
    mobile: null,
    landline: null,
    secondaryEmail: null,
  };

  it('calls banking API with account number and date range', async () => {
    userProfile.getProfile.mockResolvedValue(profileWithAccount);
    bankingApi.request.mockResolvedValue(sampleResponse);

    await service.getHistory('user-1', {
      startDate: '2021-01-01',
      endDate: '2021-01-31',
    });

    expect(bankingApi.request).toHaveBeenCalledWith(
      '/Inquiry/Account/AccountInquiry/1.0/GetAccountTransactions?AccountCategory=EXT&AccountNumber=008000999999001&StartDate=2021-01-01&EndDate=2021-01-31',
    );
  });

  it('rejects when profile has no account number', async () => {
    userProfile.getProfile.mockResolvedValue({
      ...profileWithAccount,
      accountNumber: null,
    });

    await expect(
      service.getHistory('user-1', {
        startDate: '2021-01-01',
        endDate: '2021-01-31',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(bankingApi.request).not.toHaveBeenCalled();
  });

  it('rejects when start date is after end date', async () => {
    userProfile.getProfile.mockResolvedValue(profileWithAccount);

    await expect(
      service.getHistory('user-1', {
        startDate: '2021-02-01',
        endDate: '2021-01-01',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('maps BankingApiError to BadGatewayException', async () => {
    userProfile.getProfile.mockResolvedValue(profileWithAccount);
    bankingApi.request.mockRejectedValue(
      new BankingApiError('Banking service unavailable', 503),
    );

    await expect(
      service.getHistory('user-1', {
        startDate: '2021-01-01',
        endDate: '2021-01-31',
      }),
    ).rejects.toMatchObject({
      message: 'Banking service unavailable',
      status: 502,
    });
  });
});
