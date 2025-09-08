import {MigrationInterface, QueryRunner} from "typeorm";

export class new1757275772642 implements MigrationInterface {
    name = 'new1757275772642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "credit_cards" ("id" SERIAL NOT NULL, "cardNumber" character varying(30) NOT NULL, "cardHolderName" character varying(100) NOT NULL, "cardExpirationDate" date NOT NULL, "cardCVV" character varying(10) NOT NULL, "cardBrand" character varying(30) NOT NULL, "preferredCard" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "costumer_id" integer, CONSTRAINT "PK_7749b596e358703bb3dd8b45b7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "costumers" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying NOT NULL, "cpf" character varying(14) NOT NULL, "phone" character varying(30) NOT NULL, "birthdaydate" date NOT NULL, "gender" character varying(10) NOT NULL, "ranking" integer NOT NULL DEFAULT 0, "clientCode" character varying(20), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_aec2dd4a6e2532721c56bebe427" UNIQUE ("email"), CONSTRAINT "UQ_8e2c813127d26d45a9ba9a5b18d" UNIQUE ("cpf"), CONSTRAINT "UQ_8ea03fbf3cac7c5372ee9b1e160" UNIQUE ("clientCode"), CONSTRAINT "PK_235ef3b889390c91380dbba01fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" SERIAL NOT NULL, "type" character varying(20) NOT NULL, "residenceType" character varying NOT NULL, "streetType" character varying NOT NULL, "street" character varying NOT NULL, "number" character varying NOT NULL, "complement" character varying, "neighborhood" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "zipCode" character varying NOT NULL, "observations" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "costumer_id" integer, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "price_groups" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "margin" numeric(5,4) NOT NULL DEFAULT 0, "minAllowedMargin" numeric(5,4) NOT NULL DEFAULT 0, "maxAllowedDiscount" numeric(5,4) NOT NULL DEFAULT 0, "requiresManagerApprovalBelowMargin" boolean NOT NULL DEFAULT false, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_12daf50674ff1a33e6ba2d72ea4" UNIQUE ("name"), CONSTRAINT "PK_a2692023eef7ee88fe9be1dba22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "books" ("id" SERIAL NOT NULL, "author" character varying NOT NULL, "year" integer NOT NULL, "title" character varying NOT NULL, "publisher" character varying NOT NULL, "edition" character varying NOT NULL, "ISBN" character varying NOT NULL, "pages" integer NOT NULL, "synopsis" text NOT NULL, "dimensions" json NOT NULL, "barcode" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "status" character varying NOT NULL DEFAULT 'ACTIVE', "inactivationReason" text, "inactivationCategory" character varying, "activationReason" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "pricegroupId" integer, CONSTRAINT "UQ_a5dcb40d5802b60362ff72d62d1" UNIQUE ("ISBN"), CONSTRAINT "UQ_bc953d779c418ce0f2e0f8724b9" UNIQUE ("barcode"), CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "books_categories" ("booksId" integer NOT NULL, "categoriesId" integer NOT NULL, CONSTRAINT "PK_cadf1025e076eca7d2e6bd78e66" PRIMARY KEY ("booksId", "categoriesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a1ddc2a8f7623603cfdb059673" ON "books_categories" ("booksId") `);
        await queryRunner.query(`CREATE INDEX "IDX_94ed1a076f32876f0a15626dd8" ON "books_categories" ("categoriesId") `);
        await queryRunner.query(`ALTER TABLE "credit_cards" ADD CONSTRAINT "FK_16d136d66e2b9b4aa7fd3012469" FOREIGN KEY ("costumer_id") REFERENCES "costumers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_87fc4f20180e86903e68efc8324" FOREIGN KEY ("costumer_id") REFERENCES "costumers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "books" ADD CONSTRAINT "FK_08eda758abfc109887fc0c43557" FOREIGN KEY ("pricegroupId") REFERENCES "price_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "books_categories" ADD CONSTRAINT "FK_a1ddc2a8f7623603cfdb0596732" FOREIGN KEY ("booksId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "books_categories" ADD CONSTRAINT "FK_94ed1a076f32876f0a15626dd8c" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books_categories" DROP CONSTRAINT "FK_94ed1a076f32876f0a15626dd8c"`);
        await queryRunner.query(`ALTER TABLE "books_categories" DROP CONSTRAINT "FK_a1ddc2a8f7623603cfdb0596732"`);
        await queryRunner.query(`ALTER TABLE "books" DROP CONSTRAINT "FK_08eda758abfc109887fc0c43557"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_87fc4f20180e86903e68efc8324"`);
        await queryRunner.query(`ALTER TABLE "credit_cards" DROP CONSTRAINT "FK_16d136d66e2b9b4aa7fd3012469"`);
        await queryRunner.query(`DROP INDEX "IDX_94ed1a076f32876f0a15626dd8"`);
        await queryRunner.query(`DROP INDEX "IDX_a1ddc2a8f7623603cfdb059673"`);
        await queryRunner.query(`DROP TABLE "books_categories"`);
        await queryRunner.query(`DROP TABLE "books"`);
        await queryRunner.query(`DROP TABLE "price_groups"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`DROP TABLE "costumers"`);
        await queryRunner.query(`DROP TABLE "credit_cards"`);
    }

}
