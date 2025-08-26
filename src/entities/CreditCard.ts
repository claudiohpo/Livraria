import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import {Costumer } from "./Costumer";

@Entity("CreditCard")
export class CreditCard {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cardNumber: string;

    @Column()
    cardHolderName: string;

    @Column()
    cardExpirationDate: Date;

    @Column()
    cardCVV: string;

    @Column()
    cardBrand: string;

    @Column()
    preferredCard: boolean;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @ManyToOne(() => Costumer, (client) => client.creditCards, { onDelete: "CASCADE" })
    client: Costumer;
}