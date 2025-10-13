import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./CartItem";

@Entity({ name: "carrinho" })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "boolean", default: true })
  active: boolean;

  @Column({ type: "numeric", precision: 10, scale: 2, default: 0 })
  appliedDiscount: number;

  @Column({ type: "int", nullable: true })
  couponAppliedId?: string;

  @Column({ type: "int", nullable: true })
  clienteId?: number;

  @OneToMany(() => CartItem, item => item.cart, { cascade: true })
  items: CartItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
