import { Entity, PrimaryColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Sale } from "./Sale";

@Entity({ name: "pagamentos" })
export class Payment {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ length: 40 })
  type: string; // 'CARD' | 'COUPON'

  @Column({ type: "numeric", precision: 10, scale: 2 })
  value: number;

  @Column({ type: "uuid", nullable: true })
  cardId?: string;

  @Column({ type: "uuid", nullable: true })
  couponId?: string;

  @Column({ length: 40, default: "PENDING" })
  status: string; // PENDING, APPROVED, REJECTED

  @ManyToOne(() => Sale, sale => sale.payments)
  sale: Sale;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
    updated_at: Date;
}
