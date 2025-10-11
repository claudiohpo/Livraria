import { Entity, PrimaryColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Cart } from "./Cart";

@Entity({ name: "item_carrinho" })
export class CartItem {
  @PrimaryGeneratedColumn() 
  id: number;

  @Column({ type: "integer" })
  quantity: number;

  @Column({ type: "int" })
  bookId: string;

  @Column({ type: "int" })
  cartId: string;

  @Column({ type: "numeric", precision: 10, scale: 2, nullable: true })
  price?: number; 

  @ManyToOne(() => Cart, cart => cart.items)
  @JoinColumn({ name: "cartId" }) 
  cart: Cart;


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  
}
