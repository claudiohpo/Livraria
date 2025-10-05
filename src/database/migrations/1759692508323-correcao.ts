import {MigrationInterface, QueryRunner} from "typeorm";

export class correcao1759692508323 implements MigrationInterface {
    name = 'correcao1759692508323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "estoque" ("id" SERIAL NOT NULL, "quantidade" integer NOT NULL, "custoUnitario" numeric(10,2) NOT NULL, "dataEntrada" date NOT NULL, "notaFiscal" character varying(4000), "livroId" integer NOT NULL, "fornecedorId" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_261e2d9d708b7e0ca5dd8340bc2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "estoque"`);
    }

}
