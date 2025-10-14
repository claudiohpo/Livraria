import {MigrationInterface, QueryRunner} from "typeorm";

export class frete1760393225539 implements MigrationInterface {
    name = 'frete1760393225539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipments" DROP CONSTRAINT "FK_8ab63d1375139c36c2ec9d9de58"`);
        await queryRunner.query(`CREATE TABLE "shipment_quotes" ("id" SERIAL NOT NULL, "cartId" integer, "saleId" integer, "fromPostalCode" character varying(8) NOT NULL, "toPostalCode" character varying(8) NOT NULL, "services" json NOT NULL, "lowestPrice" numeric(10,2), "chosenServiceId" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cdaece89362e9decec8d331c32b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "shipments" DROP COLUMN "estimatedDays"`);
        await queryRunner.query(`ALTER TABLE "shipments" DROP COLUMN "serviceCode"`);
        await queryRunner.query(`ALTER TABLE "shipments" ADD "serviceName" character varying`);
        await queryRunner.query(`ALTER TABLE "shipments" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "shipments" ALTER COLUMN "freightValue" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "shipments" DROP COLUMN "trackingCode"`);
        await queryRunner.query(`ALTER TABLE "shipments" ADD "trackingCode" character varying`);
        await queryRunner.query(`ALTER TABLE "shipments" DROP COLUMN "carrier"`);
        await queryRunner.query(`ALTER TABLE "shipments" ADD "carrier" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipments" DROP COLUMN "carrier"`);
        await queryRunner.query(`ALTER TABLE "shipments" ADD "carrier" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipments" DROP COLUMN "trackingCode"`);
        await queryRunner.query(`ALTER TABLE "shipments" ADD "trackingCode" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "shipments" ALTER COLUMN "freightValue" TYPE numeric(12,2)`);
        await queryRunner.query(`ALTER TABLE "shipments" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "shipments" DROP COLUMN "serviceName"`);
        await queryRunner.query(`ALTER TABLE "shipments" ADD "serviceCode" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipments" ADD "estimatedDays" integer`);
        await queryRunner.query(`DROP TABLE "shipment_quotes"`);
        await queryRunner.query(`ALTER TABLE "shipments" ADD CONSTRAINT "FK_8ab63d1375139c36c2ec9d9de58" FOREIGN KEY ("saleId") REFERENCES "vendas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
