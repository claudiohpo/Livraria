import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "inventory_reservations" })
export class InventoryReservation {
  @PrimaryGeneratedColumn()
  id: number;

 @Column({ type: "int" })
  inventoryId: number;

  @Column({ type: "int" })
  cartItemId: number;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "timestamp", nullable: true })
  expiresAt: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
