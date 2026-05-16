type BankingStatus = {
  Code?: string;
  Message?: string | null;
};

export function extractBankingStatusMessage(body: unknown): string | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  for (const value of Object.values(body as Record<string, unknown>)) {
    if (!value || typeof value !== 'object' || !('Status' in value)) {
      continue;
    }
    const status = (value as { Status?: BankingStatus }).Status;
    const message = status?.Message?.trim();
    if (message) {
      return message;
    }
  }

  return null;
}
