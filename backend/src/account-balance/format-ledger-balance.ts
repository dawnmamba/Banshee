const ACCOUNT_CATEGORY = 'EXT';

export function buildBalanceInquiryPath(accountNumber: string): string {
  const params = new URLSearchParams({
    AccountCategory: ACCOUNT_CATEGORY,
    AccountNumber: accountNumber,
  });
  return `/Inquiry/Account/AccountInquiry/1.0/GetAccountBalance?${params.toString()}`;
}

export function formatLedgerBalance(
  ledgerBalance: string,
  currency: string,
): string {
  const raw = Number(ledgerBalance);
  if (!Number.isFinite(raw)) {
    throw new Error('Invalid ledger balance');
  }

  const amount = raw / 100;
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: currency || 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
