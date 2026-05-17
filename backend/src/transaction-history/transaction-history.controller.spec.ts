import { Test, TestingModule } from '@nestjs/testing';
import { TransactionHistoryController } from './transaction-history.controller';
import { TransactionHistoryService } from './transaction-history.service';

describe('TransactionHistoryController', () => {
  let controller: TransactionHistoryController;
  const getHistory = jest.fn();

  beforeEach(async () => {
    getHistory.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionHistoryController],
      providers: [
        {
          provide: TransactionHistoryService,
          useValue: { getHistory },
        },
      ],
    }).compile();

    controller = module.get(TransactionHistoryController);
  });

  it('GET history returns transaction history DTO', async () => {
    const dto = {
      dateFrom: '2021-01-01',
      dateTo: '2021-01-31',
      transactions: [],
    };
    getHistory.mockResolvedValue(dto);

    const result = await controller.getHistory(
      {
        user: { id: 'user-1', email: 'a@b.com', firstName: 'J', lastName: 'D' },
      } as never,
      { startDate: '2021-01-01', endDate: '2021-01-31' },
    );

    expect(getHistory).toHaveBeenCalledWith('user-1', {
      startDate: '2021-01-01',
      endDate: '2021-01-31',
    });
    expect(result).toEqual(dto);
  });
});
