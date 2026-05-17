import { BadRequestException } from '@nestjs/common';

export type ParsedImportTransaction = {
  uniqueKey: string;
  postingDate: string;
  transactionCodeName: string;
  postingAmount: string;
  runningBalance: string;
};

export type ParsedImportCustomer = {
  customerId: string;
  status: {
    transactionReference: string;
    timestamp: string;
    code: string;
    message: string | null;
    description: string | null;
  };
  accountSummary: {
    accountBranch: string;
    accountBasicNumber: string;
    accountSuffix: string;
    accountShortName: string;
    customerMnemonic: string;
    accountType: string;
    currencyMnemonic: string;
    availableBalance: string;
  };
  transactions: ParsedImportTransaction[];
};

type RawTransaction = {
  Posting_date?: string;
  Transaction_Code_Name?: string;
  Posting_amount?: string;
  Running_balance?: string;
  Unique_key?: string;
};

type RawResponseItem = {
  CustomerId?: string;
  TransactionHistoryInquiryResponse?: {
    Status?: {
      Transaction_Reference?: string;
      Timestamp?: string;
      Code?: string;
      Message?: string | null;
      Description?: string | null;
    };
    AccountSummary?: {
      Account_branch?: string;
      Account_basic_number?: string;
      Account_suffix?: string;
      Account_short_name?: string;
      Customer_mnemonic?: string;
      Account_type?: string;
      Currency_mnemonic?: string;
      Available_balance?: string;
    };
    Transaction?: RawTransaction | RawTransaction[];
  };
};

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new BadRequestException(
      `Invalid import payload: ${field} is required`,
    );
  }
  return value.trim();
}

function normalizeTransactions(
  transaction: RawTransaction | RawTransaction[] | undefined,
): RawTransaction[] {
  if (!transaction) {
    return [];
  }
  return Array.isArray(transaction) ? transaction : [transaction];
}

function parseTransaction(raw: RawTransaction): ParsedImportTransaction {
  return {
    uniqueKey: requireString(raw.Unique_key, 'Transaction.Unique_key'),
    postingDate: requireString(raw.Posting_date, 'Transaction.Posting_date'),
    transactionCodeName: requireString(
      raw.Transaction_Code_Name,
      'Transaction.Transaction_Code_Name',
    ),
    postingAmount: requireString(
      raw.Posting_amount,
      'Transaction.Posting_amount',
    ),
    runningBalance: requireString(
      raw.Running_balance,
      'Transaction.Running_balance',
    ),
  };
}

export function parseImportPayload(payload: unknown): ParsedImportCustomer[] {
  if (
    !payload ||
    typeof payload !== 'object' ||
    !Array.isArray(
      (payload as { TransactionHistoryInquiryResponses?: unknown })
        .TransactionHistoryInquiryResponses,
    )
  ) {
    throw new BadRequestException(
      'Invalid import payload: TransactionHistoryInquiryResponses array is required',
    );
  }

  const items = (
    payload as { TransactionHistoryInquiryResponses: RawResponseItem[] }
  ).TransactionHistoryInquiryResponses;

  if (items.length === 0) {
    throw new BadRequestException(
      'Invalid import payload: at least one customer response is required',
    );
  }

  return items.map((item, index) => {
    const customerId = requireString(
      item.CustomerId,
      `TransactionHistoryInquiryResponses[${index}].CustomerId`,
    );
    const inquiry = item.TransactionHistoryInquiryResponse;
    if (!inquiry) {
      throw new BadRequestException(
        `Invalid import payload: TransactionHistoryInquiryResponse is required for ${customerId}`,
      );
    }

    const status = inquiry.Status;
    const account = inquiry.AccountSummary;
    if (!status || !account) {
      throw new BadRequestException(
        `Invalid import payload: Status and AccountSummary are required for ${customerId}`,
      );
    }

    return {
      customerId,
      status: {
        transactionReference: requireString(
          status.Transaction_Reference,
          'Status.Transaction_Reference',
        ),
        timestamp: requireString(status.Timestamp, 'Status.Timestamp'),
        code: requireString(status.Code, 'Status.Code'),
        message:
          status.Message === null || status.Message === undefined
            ? null
            : String(status.Message),
        description:
          status.Description === null || status.Description === undefined
            ? null
            : String(status.Description),
      },
      accountSummary: {
        accountBranch: requireString(
          account.Account_branch,
          'AccountSummary.Account_branch',
        ),
        accountBasicNumber: requireString(
          account.Account_basic_number,
          'AccountSummary.Account_basic_number',
        ),
        accountSuffix: requireString(
          account.Account_suffix,
          'AccountSummary.Account_suffix',
        ),
        accountShortName: requireString(
          account.Account_short_name,
          'AccountSummary.Account_short_name',
        ),
        customerMnemonic: requireString(
          account.Customer_mnemonic,
          'AccountSummary.Customer_mnemonic',
        ),
        accountType: requireString(
          account.Account_type,
          'AccountSummary.Account_type',
        ),
        currencyMnemonic: requireString(
          account.Currency_mnemonic,
          'AccountSummary.Currency_mnemonic',
        ),
        availableBalance: requireString(
          account.Available_balance,
          'AccountSummary.Available_balance',
        ),
      },
      transactions: normalizeTransactions(inquiry.Transaction).map(
        parseTransaction,
      ),
    };
  });
}
