import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ReturnRequest } from './ReturnRequest';

@Entity({ name: 'sale_return_items' })
export class ReturnItem {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'int' })
    returnRequestId: number;

    @ManyToOne(() => ReturnRequest)
    @JoinColumn({ name: 'returnRequestId' })
    returnRequest: ReturnRequest;

    @Column({ type: 'int' })
    saleItemId: number;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
    unitPrice: number;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}
