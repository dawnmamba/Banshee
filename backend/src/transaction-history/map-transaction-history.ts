import type {
  BankingTransaction,
  TransactionHistoryInquiryResponse,
  TransactionHistoryItemDto,
  TransactionHistoryResponseDto,
} from './transaction-history.types';

const STATUS_LABELS: Record<string, string> = {
  D: 'Posted',
};

function normalizeTransactions(
  transaction: BankingTransaction | BankingTransaction[] | undefined,
): BankingTransaction[] {
  if (!transaction) {
    return [];
  }
  return Array.isArray(transaction) ? transaction : [transaction];
}

function formatDisplayDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatPostingAmount(amount: string, currency: string): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) {
    return amount;
  }
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: currency || 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function buildSummary(transaction: BankingTransaction): string {
  const name = transaction.Transaction_Code_Name?.trim() || 'Transaction';
  const reference =
    transaction.Users_own_reference?.trim() ||
    transaction.Narrative_4?.trim() ||
    null;
  return reference ? `${name} · ${reference}` : name;
}

function mapTransaction(
  transaction: BankingTransaction,
): TransactionHistoryItemDto {
  const currency = transaction.Posting_currency?.trim() || 'LKR';
  const amount = transaction.Posting_amount ?? '0';
  const value = Number(amount);

  return {
    id: `${transaction.Event_key ?? 'tx'}-${transaction.Posting_sequence_number ?? '0'}`,
    postingDate: transaction.Posting_date,
    displayDate: formatDisplayDate(transaction.Posting_date),
    formattedAmount: formatPostingAmount(amount, currency),
    currency,
    transactionName: transaction.Transaction_Code_Name?.trim() || 'Transaction',
    statusLabel:
      STATUS_LABELS[transaction.Transaction_Status ?? ''] ??
      transaction.Transaction_Status ??
      'Unknown',
    reference: transaction.Users_own_reference?.trim() || null,
    summary: buildSummary(transaction),
    isDebit: Number.isFinite(value) ? value < 0 : false,
  };
}

export function mapTransactionHistoryResponse(
  inquiry: TransactionHistoryInquiryResponse,
): TransactionHistoryResponseDto {
  const { AccountSummary, Transaction } =
    inquiry.TransactionHistoryInquiryResponse;

  return {
    dateFrom: AccountSummary?.Date_from ?? '',
    dateTo: AccountSummary?.Date_to ?? '',
    transactions: normalizeTransactions(Transaction).map(mapTransaction),
  };
}
