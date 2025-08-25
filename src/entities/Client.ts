import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @Column({ length: 100, unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ length: 14, unique: true }) //ver se será 11 ou 14
    cpf!: string;

    @Column({ length: 20 })
    phone!: string;

    @Column({ type: "date" })
    birthdaydate!: Date;

    @Column({ length: 10 })
    gender!: string;

    //Relacionamentos (inserir abaixo conforme for criando outras entidades)


    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}