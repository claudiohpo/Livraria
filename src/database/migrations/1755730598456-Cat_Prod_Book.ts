import {MigrationInterface, QueryRunner} from "typeorm";

export class CatProdBook1755730598456 implements MigrationInterface {
    name = 'CatProdBook1755730598456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "price_groups" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "margin" numeric(5,4) NOT NULL DEFAULT 0, "minAllowedMargin" numeric(5,4) NOT NULL DEFAULT 0, "maxAllowedDiscount" numeric(5,4) NOT NULL DEFAULT 0, "requiresManagerApprovalBelowMargin" boolean NOT NULL DEFAULT false, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_12daf50674ff1a33e6ba2d72ea4" UNIQUE ("name"), CONSTRAINT "PK_a2692023eef7ee88fe9be1dba22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "books" ("id" SERIAL NOT NULL, "author" character varying NOT NULL, "year" integer NOT NULL, "title" character varying NOT NULL, "publisher" character varying NOT NULL, "edition" character varying NOT NULL, "ISBN" character varying NOT NULL, "pages" integer NOT NULL, "synopsis" text NOT NULL, "dimensions" json NOT NULL, "barcode" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "status" character varying NOT NULL DEFAULT 'ACTIVE', "inactivationReason" text, "inactivationCategory" character varying, "activationReason" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "pricegroupId" integer, CONSTRAINT "UQ_a5dcb40d5802b60362ff72d62d1" UNIQUE ("ISBN"), CONSTRAINT "UQ_bc953d779c418ce0f2e0f8724b9" UNIQUE ("barcode"), CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "category" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "books_categories" ("booksId" integer NOT NULL, "categoriesId" integer NOT NULL, CONSTRAINT "PK_cadf1025e076eca7d2e6bd78e66" PRIMARY KEY ("booksId", "categoriesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a1ddc2a8f7623603cfdb059673" ON "books_categories" ("booksId") `);
        await queryRunner.query(`CREATE INDEX "IDX_94ed1a076f32876f0a15626dd8" ON "books_categories" ("categoriesId") `);
        await queryRunner.query(`ALTER TABLE "books" ADD CONSTRAINT "FK_08eda758abfc109887fc0c43557" FOREIGN KEY ("pricegroupId") REFERENCES "price_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "books_categories" ADD CONSTRAINT "FK_a1ddc2a8f7623603cfdb0596732" FOREIGN KEY ("booksId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "books_categories" ADD CONSTRAINT "FK_94ed1a076f32876f0a15626dd8c" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books_categories" DROP CONSTRAINT "FK_94ed1a076f32876f0a15626dd8c"`);
        await queryRunner.query(`ALTER TABLE "books_categories" DROP CONSTRAINT "FK_a1ddc2a8f7623603cfdb0596732"`);
        await queryRunner.query(`ALTER TABLE "books" DROP CONSTRAINT "FK_08eda758abfc109887fc0c43557"`);
        await queryRunner.query(`DROP INDEX "IDX_94ed1a076f32876f0a15626dd8"`);
        await queryRunner.query(`DROP INDEX "IDX_a1ddc2a8f7623603cfdb059673"`);
        await queryRunner.query(`DROP TABLE "books_categories"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "books"`);
        await queryRunner.query(`DROP TABLE "price_groups"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
