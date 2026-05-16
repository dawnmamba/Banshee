export type AccountBalanceInquiryResponse = {
  Account_Balance_Inquiry: {
    Status: {
      Code: string;
      Message: string | null;
    };
    Account: {
      Ledger_balance: string;
      Currency_mnemonic: string;
    };
  };
};

export type AccountBalanceDto = {
  formattedBalance: string;
  currency: string;
  ledgerBalance: string;
};
