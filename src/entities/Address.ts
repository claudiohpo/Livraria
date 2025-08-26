import { Entity, PrimaryGeneratedColumn, Column,ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Costumer } from "./Costumer";

export enum AddressType {
    DELIVERY = "DELIVERY",
    BILLING = "BILLING"
}

@Entity("Address")
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    residenceType: string;

    @Column()
    streetType: string;

    @Column()
    street: string;

    @Column()
    number: string;

    @Column()
    complement: string;

    @Column()
    neighborhood: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    zipCode: string;

    @Column()
    observations: string;

    @Column({
        type: "enum",
        enum: AddressType
    })
    type: AddressType;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @ManyToOne(() => Costumer, (client) => client.addresses, { onDelete: "CASCADE" })
    client: Costumer;

}