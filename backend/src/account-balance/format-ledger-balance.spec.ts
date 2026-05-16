import {
  buildBalanceInquiryPath,
  formatLedgerBalance,
} from './format-ledger-balance';

describe('formatLedgerBalance', () => {
  it('formats ledger value as LKR currency (cents to units)', () => {
    expect(formatLedgerBalance('10050000', 'LKR')).toMatch(/100,500/);
    expect(formatLedgerBalance('10050000', 'LKR')).toMatch(/LKR/);
  });

  it('buildBalanceInquiryPath includes EXT category and account number', () => {
    expect(buildBalanceInquiryPath('001001338903101')).toBe(
      '/Inquiry/Account/AccountInquiry/1.0/GetAccountBalance?AccountCategory=EXT&AccountNumber=001001338903101',
    );
  });
});
