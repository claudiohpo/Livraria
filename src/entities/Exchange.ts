import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity({ name: 'trocas' })
export class Exchange {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;


    @Column({ type: 'varchar', length: 20 })
    status: string; // EM_TROCA | AUTORIZADA | TROCADO | REJEITADA | CANCELADA


    @Column({ type: 'text', nullable: true })
    motivo: string;


    @Column({ type: 'timestamp', nullable: true })
    dataSolicitacao: Date;


    @Column({ type: 'timestamp', nullable: true })
    dataAutorizacao: Date;


    @Column({ type: 'timestamp', nullable: true })
    dataRecebimento: Date;


    @Column({ type: 'varchar', length: 255, nullable: true })
    codigoCupom: string;


    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
    valorCupom: number;


    @Column({ type: 'int', nullable: true })
    vendaId: number; // saleId


    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;


    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}