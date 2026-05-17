import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

const ADMIN_EMAIL = 'admin@banshee.local';
const ADMIN_PASSWORD = 'BansheeAdmin123!';

export class AddUserRoleAndSeedAdmin1747600000000 implements MigrationInterface {
  name = 'AddUserRoleAndSeedAdmin1747600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "role" character varying NOT NULL DEFAULT 'user'
    `);

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await queryRunner.query(
      `
      INSERT INTO "users" (
        "email",
        "password_hash",
        "first_name",
        "last_name",
        "role"
      )
      SELECT $1::varchar, $2::varchar, $3::varchar, $4::varchar, $5::varchar
      WHERE NOT EXISTS (
        SELECT 1 FROM "users" WHERE "email" = $1::varchar
      )
    `,
      [ADMIN_EMAIL, passwordHash, 'System', 'Administrator', 'admin'],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "users" WHERE "email" = $1`, [
      ADMIN_EMAIL,
    ]);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
  }
}
