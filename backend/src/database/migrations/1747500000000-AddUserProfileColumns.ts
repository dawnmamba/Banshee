import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserProfileColumns1747500000000 implements MigrationInterface {
  name = 'AddUserProfileColumns1747500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "account_number" character varying,
      ADD COLUMN "nic" character varying,
      ADD COLUMN "address" character varying,
      ADD COLUMN "mobile" character varying,
      ADD COLUMN "landline" character varying,
      ADD COLUMN "secondary_email" character varying
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "account_number",
      DROP COLUMN "nic",
      DROP COLUMN "address",
      DROP COLUMN "mobile",
      DROP COLUMN "landline",
      DROP COLUMN "secondary_email"
    `);
  }
}
