import { QueryRunner } from 'typeorm';
import { AddUserRoleAndSeedAdmin1747600000000 } from './migrations/1747600000000-AddUserRoleAndSeedAdmin';

describe('AddUserRoleAndSeedAdmin1747600000000', () => {
  it('casts seed parameters to varchar for Postgres', async () => {
    const queries: string[] = [];
    const queryRunner = {
      query: jest.fn((sql: string) => {
        queries.push(sql);
        return Promise.resolve();
      }),
    } as unknown as QueryRunner;

    await new AddUserRoleAndSeedAdmin1747600000000().up(queryRunner);

    const seedQuery = queries.find((sql) =>
      sql.includes('INSERT INTO "users"'),
    );
    expect(seedQuery).toBeDefined();
    expect(seedQuery).toMatch(/\$1::varchar/);
    expect(seedQuery).toMatch(/"email" = \$1::varchar/);
  });
});
