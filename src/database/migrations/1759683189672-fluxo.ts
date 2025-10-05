import {MigrationInterface, QueryRunner} from "typeorm";

export class fluxo1759683189672 implements MigrationInterface {
    name = 'fluxo1759683189672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "item_carrinho" ("id" uuid NOT NULL, "quantity" integer NOT NULL, "bookId" uuid NOT NULL, "cartId" uuid NOT NULL, "price" numeric(10,2), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6875e5063f944f6e09d21a038f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "carrinho" ("id" uuid NOT NULL, "active" boolean NOT NULL DEFAULT true, "appliedDiscount" numeric(10,2) NOT NULL DEFAULT 0, "couponAppliedId" uuid, "clienteId" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c3e0fa0f35ffe1bad1385bb5110" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cupons" ("id" uuid NOT NULL, "code" character varying NOT NULL, "value" numeric(10,2) NOT NULL, "validity" date, "used" boolean NOT NULL DEFAULT false, "type" character varying(20), "minPurchaseValue" numeric(10,2), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e4d1bd56029c646151af0cab198" UNIQUE ("code"), CONSTRAINT "PK_a391ecb025ec40b07972ed7de19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "estoque" ("id" character(36) NOT NULL, "quantidade" integer NOT NULL, "custoUnitario" numeric(10,2) NOT NULL, "dataEntrada" date NOT NULL, "notaFiscal" character varying(4000), "livroId" character(36) NOT NULL, "fornecedorId" character(36), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_261e2d9d708b7e0ca5dd8340bc2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory_reservations" ("id" character(36) NOT NULL, "inventoryId" character(36) NOT NULL, "cartItemId" character(36) NOT NULL, "quantity" integer NOT NULL, "expires_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_af438c0ce596eea6c4d472a0489" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "venda_itens" ("id" uuid NOT NULL, "quantity" integer NOT NULL, "unitPrice" numeric(10,2) NOT NULL, "livroId" uuid NOT NULL, "saleId" uuid, CONSTRAINT "PK_9a2a52944d45db3c3b7a967272a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vendas" ("id" uuid NOT NULL, "status" character varying(40) NOT NULL, "freightValue" numeric(10,2) NOT NULL DEFAULT 0, "trackingCode" character varying, "saleDate" TIMESTAMP, "deliveryDate" TIMESTAMP, "clienteId" uuid, "enderecoEntregaId" uuid, "total" numeric(10,2) NOT NULL DEFAULT 0, "discountApplied" numeric(10,2) NOT NULL DEFAULT 0, "couponUsedId" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_371c42d415efbac7097bd08b744" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pagamentos" ("id" uuid NOT NULL, "type" character varying(40) NOT NULL, "value" numeric(10,2) NOT NULL, "cardId" uuid, "couponId" uuid, "status" character varying(40) NOT NULL DEFAULT 'PENDING', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "saleId" uuid, CONSTRAINT "PK_0127f8bc8386b0e522c7cc5a9fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "item_carrinho" ADD CONSTRAINT "FK_db48e1aa3a5434a9013b4ef74b0" FOREIGN KEY ("cartId") REFERENCES "carrinho"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "venda_itens" ADD CONSTRAINT "FK_cc731488e0a2a44e6fd4ac0440f" FOREIGN KEY ("saleId") REFERENCES "vendas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pagamentos" ADD CONSTRAINT "FK_14941f135fb4df3d27a796853bd" FOREIGN KEY ("saleId") REFERENCES "vendas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pagamentos" DROP CONSTRAINT "FK_14941f135fb4df3d27a796853bd"`);
        await queryRunner.query(`ALTER TABLE "venda_itens" DROP CONSTRAINT "FK_cc731488e0a2a44e6fd4ac0440f"`);
        await queryRunner.query(`ALTER TABLE "item_carrinho" DROP CONSTRAINT "FK_db48e1aa3a5434a9013b4ef74b0"`);
        await queryRunner.query(`DROP TABLE "pagamentos"`);
        await queryRunner.query(`DROP TABLE "vendas"`);
        await queryRunner.query(`DROP TABLE "venda_itens"`);
        await queryRunner.query(`DROP TABLE "inventory_reservations"`);
        await queryRunner.query(`DROP TABLE "estoque"`);
        await queryRunner.query(`DROP TABLE "cupons"`);
        await queryRunner.query(`DROP TABLE "carrinho"`);
        await queryRunner.query(`DROP TABLE "item_carrinho"`);
    }

}
