import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity({ name: 'troca_itens' })
export class ExchangeItem {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;


    @Column({ type: 'int' })
    trocaId: number; // exchangeId


    @Column({ type: 'int' })
    vendaItemId: number; // saleItemId


    @Column({ type: 'int' })
    quantidade: number;


    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;


    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}