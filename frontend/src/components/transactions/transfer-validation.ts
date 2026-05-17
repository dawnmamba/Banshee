export function parsePositiveAmount(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const amount = Number(trimmed);
  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }
  return amount;
}

export function validateInternalTransfer(fields: {
  toAccount: string;
  amount: string;
}): string | null {
  if (!fields.toAccount.trim()) {
    return 'To account number is required';
  }
  if (parsePositiveAmount(fields.amount) === null) {
    return 'Enter a valid amount greater than zero';
  }
  return null;
}

export function validateExternalTransfer(fields: {
  beneficiaryName: string;
  routingNumber: string;
  accountNumber: string;
  amount: string;
}): string | null {
  if (!fields.beneficiaryName.trim()) {
    return 'Beneficiary name is required';
  }
  if (!fields.routingNumber.trim()) {
    return 'Routing number is required';
  }
  if (!fields.accountNumber.trim()) {
    return 'Account number is required';
  }
  if (parsePositiveAmount(fields.amount) === null) {
    return 'Enter a valid amount greater than zero';
  }
  return null;
}

export const TRANSFER_VALIDATED_MESSAGE =
  'Transfer details validated. Banking integration coming soon.';
