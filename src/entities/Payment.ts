// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
// import { Sale } from "./Sale";

// @Entity({ name: "pagamentos" })
// export class Payment {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 40 })
//   type: string; // 'CARD' | 'COUPON'

//   @Column({ type: "numeric", precision: 10, scale: 2 })
//   value: number;

//   // ids numéricos (sequenciais) -- não uuid
//   @Column({ type: "int", nullable: true })
//   cardId?: number;

//   @Column({ type: "int", nullable: true })
//   couponId?: number;

//   @Column({ length: 40, default: "PENDING" })
//   status: string; // PENDING, APPROVED, REJECTED

//   @ManyToOne(() => Sale, sale => sale.payments)
//   @JoinColumn({ name: "saleId" })
//   sale: Sale;

//   @CreateDateColumn()
//   created_at: Date;

//   @UpdateDateColumn()
//   updated_at: Date;
// }


import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Sale } from "./Sale";

@Entity({ name: "pagamentos" })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  type: string; // 'CARD' | 'COUPON'

  @Column({ type: "numeric", precision: 12, scale: 2 })
  value: number;

  @Column({ type: "int", nullable: true })
  cardId?: number;

  @Column({ type: "int", nullable: true })
  couponId?: number;

  @Column({ length: 40, default: "PENDING" })
  status: string; // PENDING, APPROVED, REJECTED

  @ManyToOne(() => Sale, sale => sale.payments)
  @JoinColumn({ name: "saleId" })
  sale: Sale;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
