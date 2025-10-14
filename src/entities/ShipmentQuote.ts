import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "shipment_quotes" })
export class ShipmentQuote {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int", nullable: true })
    cartId?: number;

    @Column({ type: "int", nullable: true })
    saleId?: number;

    @Column({ type: "varchar", length: 8 })
    fromPostalCode!: string;

    @Column({ type: "varchar", length: 8 })
    toPostalCode!: string;

    @Column({ type: "json", nullable: false })
    services!: any; // armazenamos o JSON retornado pela API

    @Column({ type: "numeric", precision: 10, scale: 2, nullable: true })
    lowestPrice?: number;

    @Column({ type: "varchar", nullable: true })
    chosenServiceId?: string;

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at!: Date;
}
