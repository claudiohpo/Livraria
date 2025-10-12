import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "cupons" })
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  value: number;

  @Column({ type: "date", nullable: true })
  validity?: Date;

  @Column({ type: "boolean", default: false })
  used: boolean;

  @Column({ type: "int", nullable: true })
  saleUsedId?: number;

  @Column({ length: 20, nullable: true })
  type?: string; // 'PROMO' | 'EXCHANGE'

  @Column({ type: "numeric", precision: 12, scale: 2, nullable: true })
  minPurchaseValue?: number;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
