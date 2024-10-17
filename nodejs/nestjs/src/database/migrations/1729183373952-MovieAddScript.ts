import { MigrationInterface, QueryRunner } from "typeorm";

export class MovieAddScript1729183373952 implements MigrationInterface {
    name = 'MovieAddScript1729183373952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" ADD "script" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "script"`);
    }

}
