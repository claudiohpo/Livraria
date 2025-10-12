// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
// import { Sale } from "./Sale";

// @Entity({ name: "venda_itens" })
// export class SaleItem {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: "int" })
//   quantity: number;

//   @Column({ type: "numeric", precision: 10, scale: 2 })
//   unitPrice: number;

//   @Column({ type: "int" })
//   bookId: number;

//   @ManyToOne(() => Sale, sale => sale.items)
//   @JoinColumn({ name: "saleId" })
//   sale: Sale;
// }


import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Sale } from "./Sale";

@Entity({ name: "venda_itens" })
export class SaleItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer" })
  quantity: number;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  unitPrice: number;

  @Column({ type: "int", name: "bookId" })
  bookId: number;

  @ManyToOne(() => Sale, sale => sale.items)
  @JoinColumn({ name: "saleId" })
  sale: Sale;
}
