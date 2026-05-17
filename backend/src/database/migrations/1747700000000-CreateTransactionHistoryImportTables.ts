import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransactionHistoryImportTables1747700000000 implements MigrationInterface {
  name = 'CreateTransactionHistoryImportTables1747700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "imported_customers" (
        "customer_id" character varying NOT NULL,
        CONSTRAINT "PK_imported_customers" PRIMARY KEY ("customer_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "imported_inquiry_statuses" (
        "customer_id" character varying NOT NULL,
        "transaction_reference" character varying NOT NULL,
        "inquiry_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL,
        "code" character varying NOT NULL,
        "message" character varying,
        "description" character varying,
        CONSTRAINT "PK_imported_inquiry_statuses" PRIMARY KEY ("customer_id"),
        CONSTRAINT "FK_imported_inquiry_statuses_customer"
          FOREIGN KEY ("customer_id") REFERENCES "imported_customers"("customer_id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "imported_account_summaries" (
        "customer_id" character varying NOT NULL,
        "account_branch" character varying NOT NULL,
        "account_basic_number" character varying NOT NULL,
        "account_suffix" character varying NOT NULL,
        "account_short_name" character varying NOT NULL,
        "customer_mnemonic" character varying NOT NULL,
        "account_type" character varying NOT NULL,
        "currency_mnemonic" character varying NOT NULL,
        "available_balance" numeric(18, 2) NOT NULL,
        CONSTRAINT "PK_imported_account_summaries" PRIMARY KEY ("customer_id"),
        CONSTRAINT "FK_imported_account_summaries_customer"
          FOREIGN KEY ("customer_id") REFERENCES "imported_customers"("customer_id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "imported_bank_transactions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "customer_id" character varying NOT NULL,
        "unique_key" character varying NOT NULL,
        "posting_date" date NOT NULL,
        "transaction_code_name" character varying NOT NULL,
        "posting_amount" numeric(18, 2) NOT NULL,
        "running_balance" numeric(18, 2) NOT NULL,
        CONSTRAINT "PK_imported_bank_transactions" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_imported_bank_transactions_unique_key" UNIQUE ("unique_key"),
        CONSTRAINT "FK_imported_bank_transactions_customer"
          FOREIGN KEY ("customer_id") REFERENCES "imported_customers"("customer_id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_imported_bank_transactions_customer_id"
        ON "imported_bank_transactions" ("customer_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "imported_bank_transactions"`);
    await queryRunner.query(`DROP TABLE "imported_account_summaries"`);
    await queryRunner.query(`DROP TABLE "imported_inquiry_statuses"`);
    await queryRunner.query(`DROP TABLE "imported_customers"`);
  }
}
