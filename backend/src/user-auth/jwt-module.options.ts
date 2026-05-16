import type { JwtModuleOptions } from '@nestjs/jwt';
import type { StringValue } from 'ms';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`${name} environment variable is required`);
  }
  return value;
}

export function buildJwtModuleOptions(): JwtModuleOptions {
  return {
    secret: requireEnv('JWT_SECRET'),
    signOptions: {
      expiresIn: requireEnv('JWT_EXPIRES_IN') as StringValue,
    },
  };
}
