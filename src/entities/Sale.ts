import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { SaleItem } from "./SaleItem";
import { Payment } from "./Payment";
import { Costumer } from "./Costumer";

@Entity({ name: "vendas" })
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  status: string; // OPEN, PROCESSING, APPROVED, REJECTED, IN_TRANSIT, DELIVERED

  @Column({ type: "numeric", precision: 10, scale: 2, default: 0 })
  freightValue: number;

  @Column({ type: "int", nullable: true })
  clientId?: number;

  @Column({ type: "int", nullable: true })
  deliveryAddressId?: number;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  total: number;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  appliedDiscount: number;

  @Column({ type: "int", nullable: true })
  couponUsedId?: number;

  @OneToMany(() => SaleItem, item => item.sale, { cascade: true })
  items: SaleItem[];

  @OneToMany(() => Payment, p => p.sale, { cascade: true })
  payments: Payment[];

  @ManyToOne(() => Costumer, (c) => c.addresses, { nullable: true })
  @JoinColumn({ name: "clientId" })
  client?: Costumer;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
