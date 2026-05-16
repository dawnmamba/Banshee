process.env.DB_HOST = process.env.DB_HOST ?? 'localhost';
process.env.DB_PORT = process.env.DB_PORT ?? '5432';
process.env.DB_NAME = process.env.DB_NAME ?? 'banshee';
process.env.DB_USER = process.env.DB_USER ?? 'postgres';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? '';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'e2e-test-jwt-secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1h';
process.env.BANKING_API_BASE_URL =
  process.env.BANKING_API_BASE_URL ?? 'http://bank.example:3000';
process.env.BANKING_API_KEY =
  process.env.BANKING_API_KEY ?? 'e2e-test-banking-api-key';
