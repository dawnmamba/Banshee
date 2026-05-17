export type BankingTransaction = {
  Posting_date: string;
  Posting_currency?: string;
  Transaction_Code_Name?: string;
  Posting_amount: string;
  Transaction_Status?: string;
  Users_own_reference?: string | null;
  Narrative_4?: string | null;
  Posting_sequence_number?: string;
  Event_key?: string;
};

export type TransactionHistoryInquiryResponse = {
  TransactionHistoryInquiryResponse: {
    Status: {
      Code: string;
      Message?: string | null;
    };
    AccountSummary?: {
      Date_from?: string;
      Date_to?: string;
    };
    Transaction?: BankingTransaction | BankingTransaction[];
  };
};

export type TransactionHistoryItemDto = {
  id: string;
  postingDate: string;
  displayDate: string;
  formattedAmount: string;
  currency: string;
  transactionName: string;
  statusLabel: string;
  reference: string | null;
  summary: string;
  isDebit: boolean;
};

export type TransactionHistoryResponseDto = {
  dateFrom: string;
  dateTo: string;
  transactions: TransactionHistoryItemDto[];
};
