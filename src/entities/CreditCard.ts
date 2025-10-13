import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, } from "typeorm";
import { Costumer } from "./Costumer";

@Entity("credit_cards")
export class CreditCard {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 30 })
  cardNumber!: string;

  @Column({ length: 100 })
  cardHolderName!: string;

  @Column({ type: "date" })
  cardExpirationDate!: Date;

  @Column({ length: 10 })
  cardCVV!: string;

  @Column({ length: 30 })
  cardBrand!: string;

  @Column({ default: false })
  preferredCard!: boolean;

  @ManyToOne(() => Costumer, (c) => c.creditCards, { onDelete: "CASCADE" })
  @JoinColumn({ name: "costumer_id" })
  costumer!: Costumer;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
