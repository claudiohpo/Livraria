import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "shipments" })
export class Shipment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int", nullable: false })
    saleId!: number;

    @Column({ type: "numeric", precision: 10, scale: 2 })
    freightValue!: number;

    @Column({ type: "varchar", nullable: true })
    trackingCode?: string;

    @Column({ type: "varchar", nullable: true })
    carrier?: string;

    @Column({ type: "varchar", nullable: true })
    serviceName?: string;

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at!: Date;
}
