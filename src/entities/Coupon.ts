import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "cupons" })
export class Coupon {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  value: number;

  @Column({ type: "date", nullable: true })
  validity?: Date;

  @Column({ type: "boolean", default: false })
  used: boolean;

  @Column({ length: 20, nullable: true })
  type?: string; // 'PROMO' | 'EXCHANGE'

  @Column({ type: "numeric", precision: 10, scale: 2, nullable: true })
  minPurchaseValue?: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
    updated_at: Date;
}
