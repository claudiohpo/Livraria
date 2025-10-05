import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("price_groups")
export class PriceGroup {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  // margem como decimal: 0.30 => 30%
  @Column("decimal", { precision: 5, scale: 4, default: 0.0 })
  margin!: number;

  // margem mínima permitida (por exemplo 0.20 = 20%)
  @Column("decimal", { precision: 5, scale: 4, default: 0.0 })
  minAllowedMargin!: number;

  // desconto máximo permitido (por exemplo 0.15 = 15%)
  @Column("decimal", { precision: 5, scale: 4, default: 0.0 })
  maxAllowedDiscount!: number;

  @Column({ default: false })
  requiresManagerApprovalBelowMargin!: boolean;

  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
