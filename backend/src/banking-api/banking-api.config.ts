export const BANKING_API_CONFIG = 'BANKING_API_CONFIG';

export type BankingApiConfig = {
  baseUrl: string;
  apiKey: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`${name} environment variable is required`);
  }
  return value;
}

export function buildBankingApiConfig(): BankingApiConfig {
  return {
    baseUrl: requireEnv('BANKING_API_BASE_URL').replace(/\/$/, ''),
    apiKey: requireEnv('BANKING_API_KEY'),
  };
}
