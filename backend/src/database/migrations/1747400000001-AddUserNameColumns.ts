import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserNameColumns1747400000001 implements MigrationInterface {
  name = 'AddUserNameColumns1747400000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "first_name" character varying NOT NULL DEFAULT '',
      ADD COLUMN "last_name" character varying NOT NULL DEFAULT ''
    `);
    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "first_name" DROP DEFAULT,
      ALTER COLUMN "last_name" DROP DEFAULT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "first_name",
      DROP COLUMN "last_name"
    `);
  }
}
