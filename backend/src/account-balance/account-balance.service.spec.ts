import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BankingApiError,
  BankingApiService,
} from '../banking-api/banking-api.service';
import { UserProfileService } from '../user-profile/user-profile.service';
import { AccountBalanceService } from './account-balance.service';

const sampleInquiry = {
  Account_Balance_Inquiry: {
    Status: { Code: '0000', Message: null },
    Account: {
      Ledger_balance: '10050000',
      Currency_mnemonic: 'LKR',
    },
  },
};

describe('AccountBalanceService', () => {
  let service: AccountBalanceService;
  let bankingApi: jest.Mocked<Pick<BankingApiService, 'request'>>;
  let userProfile: jest.Mocked<Pick<UserProfileService, 'getProfile'>>;

  beforeEach(async () => {
    bankingApi = { request: jest.fn() };
    userProfile = { getProfile: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountBalanceService,
        { provide: BankingApiService, useValue: bankingApi },
        { provide: UserProfileService, useValue: userProfile },
      ],
    }).compile();

    service = module.get(AccountBalanceService);
  });

  it('parses ledger balance and formats LKR', async () => {
    userProfile.getProfile.mockResolvedValue({
      id: 'user-1',
      email: 'a@b.com',
      firstName: 'Jane',
      lastName: 'Doe',
      accountNumber: '001001338903101',
      nic: null,
      address: null,
      mobile: null,
      landline: null,
      secondaryEmail: null,
    });
    bankingApi.request.mockResolvedValue(sampleInquiry);

    const result = await service.getBalance('user-1');

    expect(bankingApi.request).toHaveBeenCalledWith(
      '/Inquiry/Account/AccountInquiry/1.0/GetAccountBalance?AccountCategory=EXT&AccountNumber=001001338903101',
    );
    expect(result.ledgerBalance).toBe('10050000');
    expect(result.currency).toBe('LKR');
    expect(result.formattedBalance).toMatch(/LKR/);
    expect(result.formattedBalance).toMatch(/100,500/);
  });

  it('rejects when profile has no account number', async () => {
    userProfile.getProfile.mockResolvedValue({
      id: 'user-1',
      email: 'a@b.com',
      firstName: 'Jane',
      lastName: 'Doe',
      accountNumber: null,
      nic: null,
      address: null,
      mobile: null,
      landline: null,
      secondaryEmail: null,
    });

    await expect(service.getBalance('user-1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(bankingApi.request).not.toHaveBeenCalled();
  });

  it('rejects non-success banking status code with banking message', async () => {
    userProfile.getProfile.mockResolvedValue({
      id: 'user-1',
      email: 'a@b.com',
      firstName: 'Jane',
      lastName: 'Doe',
      accountNumber: '001001338903101',
      nic: null,
      address: null,
      mobile: null,
      landline: null,
      secondaryEmail: null,
    });
    bankingApi.request.mockResolvedValue({
      Account_Balance_Inquiry: {
        Status: { Code: '9999', Message: 'Account not authorized' },
        Account: { Ledger_balance: '0', Currency_mnemonic: 'LKR' },
      },
    });

    await expect(service.getBalance('user-1')).rejects.toMatchObject({
      message: 'Account not authorized',
      status: 502,
    });
  });

  it('maps BankingApiError message to BadGatewayException', async () => {
    userProfile.getProfile.mockResolvedValue({
      id: 'user-1',
      email: 'a@b.com',
      firstName: 'Jane',
      lastName: 'Doe',
      accountNumber: '001001338903101',
      nic: null,
      address: null,
      mobile: null,
      landline: null,
      secondaryEmail: null,
    });
    bankingApi.request.mockRejectedValue(
      new BankingApiError('Banking service unavailable', 503),
    );

    await expect(service.getBalance('user-1')).rejects.toMatchObject({
      message: 'Banking service unavailable',
      status: 502,
    });
  });
});
