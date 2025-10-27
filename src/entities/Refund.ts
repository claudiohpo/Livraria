import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity({ name: 'sale_refunds' })
export class Refund {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;


    @Column({ type: 'int' })
    saleId: number;


    @Column({ type: 'numeric', precision: 12, scale: 2 })
    amount: number;


    @Column({ type: 'varchar', length: 40 })
    method: string; // CARD | COUPON | STORE_CREDIT | CASH


    @Column({ type: 'varchar', length: 20, default: 'PENDING' })
    status: string; // PENDING | COMPLETED | FAILED


    @Column({ type: 'int', nullable: true })
    paymentId: number | null; // original payment reference


    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;


    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}