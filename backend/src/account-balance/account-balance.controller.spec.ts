import { Test, TestingModule } from '@nestjs/testing';
import { AccountBalanceController } from './account-balance.controller';
import { AccountBalanceService } from './account-balance.service';

describe('AccountBalanceController', () => {
  let controller: AccountBalanceController;
  const getBalance = jest.fn();

  beforeEach(async () => {
    getBalance.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountBalanceController],
      providers: [
        {
          provide: AccountBalanceService,
          useValue: { getBalance },
        },
      ],
    }).compile();

    controller = module.get(AccountBalanceController);
  });

  it('GET balance returns balance DTO', async () => {
    const dto = {
      formattedBalance: 'LKR 100,500.00',
      currency: 'LKR',
      ledgerBalance: '10050000',
    };
    getBalance.mockResolvedValue(dto);

    const result = await controller.getBalance({
      user: { id: 'user-1', email: 'a@b.com', firstName: 'J', lastName: 'D' },
    } as never);

    expect(getBalance).toHaveBeenCalledWith('user-1');
    expect(result).toEqual(dto);
  });
});
