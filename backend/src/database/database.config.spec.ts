import { getDatabaseConfig } from './database.config';

describe('getDatabaseConfig', () => {
  const env = process.env;

  beforeEach(() => {
    process.env = { ...env };
    process.env.DB_HOST = 'db.example.com';
    process.env.DB_PORT = '5433';
    process.env.DB_NAME = 'banshee';
    process.env.DB_USER = 'app';
    process.env.DB_PASSWORD = 'secret';
  });

  afterEach(() => {
    process.env = env;
  });

  it('maps env vars to postgres TypeORM options', () => {
    const config = getDatabaseConfig();

    expect(config).toMatchObject({
      type: 'postgres',
      host: 'db.example.com',
      port: 5433,
      database: 'banshee',
      username: 'app',
      password: 'secret',
      synchronize: false,
      entities: [],
    });
  });

  it('throws when DB_HOST is missing', () => {
    delete process.env.DB_HOST;

    expect(() => getDatabaseConfig()).toThrow(/DB_HOST/);
  });

  it('allows an empty DB_PASSWORD', () => {
    process.env.DB_PASSWORD = '';

    const config = getDatabaseConfig();

    expect(config.password).toBe('');
  });
});
