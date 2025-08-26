import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Address } from "./Address";
import { CreditCard } from "./CreditCard";

@Entity()
export class Costumer {
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

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    //Relacionamentos (inserir abaixo conforme for criando as entidades) **NÃO ESQUECER**

    @OneToMany(() => Address, (address) => address.client, { cascade: true })
    addresses: Address[];

    @OneToMany(() => CreditCard, (creditCard) => creditCard.client, { cascade: true })
    creditCards: CreditCard[];
}