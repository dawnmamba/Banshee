import { DataSourceOptions } from 'typeorm';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`${name} environment variable is required`);
  }
  return value;
}

export function getDatabaseConfig(): DataSourceOptions {
  const port = Number(requireEnv('DB_PORT'));
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('DB_PORT must be a valid port number (1-65535)');
  }

  return {
    type: 'postgres',
    host: requireEnv('DB_HOST'),
    port,
    database: requireEnv('DB_NAME'),
    username: requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD'),
    entities: [],
    synchronize: false,
    retryAttempts: 0,
    extra: {
      connectionTimeoutMillis: 2000,
    },
  };
}
