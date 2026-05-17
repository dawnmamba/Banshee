export type FraudAnalysisCustomerPayload = {
  customerId: string;
  inquiryStatus: {
    transactionReference: string;
    inquiryTimestamp: string;
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
  transactions: Array<{
    uniqueKey: string;
    postingDate: string;
    transactionCodeName: string;
    postingAmount: string;
    runningBalance: string;
  }>;
};

export type FraudAnalysisPayload = {
  customers: FraudAnalysisCustomerPayload[];
};

export type FlaggedCustomerDto = {
  customerId: string;
  reason: string;
};

export type FraudAnalysisResultDto = {
  riskLevel: 'low' | 'medium' | 'high';
  fraudDetected: boolean;
  flaggedCustomers: FlaggedCustomerDto[];
  narrative: string;
};
