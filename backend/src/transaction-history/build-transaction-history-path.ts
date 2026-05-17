const ACCOUNT_CATEGORY = 'EXT';

export function buildTransactionHistoryPath(
  accountNumber: string,
  startDate: string,
  endDate: string,
): string {
  const params = new URLSearchParams({
    AccountCategory: ACCOUNT_CATEGORY,
    AccountNumber: accountNumber,
    StartDate: startDate,
    EndDate: endDate,
  });
  return `/Inquiry/Account/AccountInquiry/1.0/GetAccountTransactions?${params.toString()}`;
}
