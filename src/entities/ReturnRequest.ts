import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { ReturnItem } from './ReturnItem';

@Entity({ name: 'sale_returns' })
export class ReturnRequest {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'int' })
    saleId: number;

    @Column({ type: 'varchar', length: 20, default: 'PENDING' })
    status: string; // PENDING | AUTHORIZED | REJECTED | COMPLETED | CANCELLED

    @Column({ type: 'text', nullable: true })
    reason?: string;

    @OneToMany(() => ReturnItem, ri => ri.returnRequest, { cascade: true })
    items: ReturnItem[];

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}
