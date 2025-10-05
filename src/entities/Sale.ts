import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { SaleItem } from "./SaleItem";
import { Payment } from "./Payment";

@Entity({ name: "vendas" })
export class Sale {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ length: 40 })
  status: string; // OPEN, PROCESSING, APPROVED, REJECTED, IN_TRANSIT, DELIVERED

  @Column({ type: "numeric", precision: 10, scale: 2, default: 0 })
  freightValue: number;

  @Column({ type: "varchar", nullable: true })
  trackingCode?: string;

  @Column({ type: "timestamp", nullable: true })
  saleDate?: Date;

  @Column({ type: "timestamp", nullable: true })
  deliveryDate?: Date;

  @Column({ type: "uuid", nullable: true })
  clienteId?: string; //Ver nome correto

  @Column({ type: "uuid", nullable: true })
  enderecoEntregaId?: string; //ver nome correto    

  @Column({ type: "numeric", precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: "numeric", precision: 10, scale: 2, default: 0 })
  discountApplied: number;

  @Column({ type: "uuid", nullable: true })
  couponUsedId?: string;

  @OneToMany(() => SaleItem, item => item.sale, { cascade: true })
  items: SaleItem[];

  @OneToMany(() => Payment, p => p.sale, { cascade: true })
  payments: Payment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
