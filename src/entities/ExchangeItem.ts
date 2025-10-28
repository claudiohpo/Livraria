// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';


// @Entity({ name: 'troca_itens' })
// export class ExchangeItem {
//     @PrimaryGeneratedColumn({ type: 'int' })
//     id: number;


//     @Column({ type: 'int' })
//     trocaId: number; // exchangeId


//     @Column({ type: 'int' })
//     vendaItemId: number; // saleItemId


//     @Column({ type: 'int' })
//     quantidade: number;


//     @CreateDateColumn({ name: 'created_at' })
//     created_at: Date;


//     @UpdateDateColumn({ name: 'updated_at' })
//     updated_at: Date;
// }
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Exchange } from './Exchange';

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

  @ManyToOne(() => Exchange, exchange => exchange.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trocaId' })
  exchange: Exchange;
}