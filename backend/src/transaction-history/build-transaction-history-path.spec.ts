import { buildTransactionHistoryPath } from './build-transaction-history-path';

describe('buildTransactionHistoryPath', () => {
  it('builds GetAccountTransactions inquiry path', () => {
    expect(
      buildTransactionHistoryPath(
        '008000999999001',
        '2021-01-01',
        '2021-01-31',
      ),
    ).toBe(
      '/Inquiry/Account/AccountInquiry/1.0/GetAccountTransactions?AccountCategory=EXT&AccountNumber=008000999999001&StartDate=2021-01-01&EndDate=2021-01-31',
    );
  });
});
