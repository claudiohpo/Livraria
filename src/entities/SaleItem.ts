import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { Sale } from "./Sale";

@Entity({ name: "venda_itens" })
export class SaleItem {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "integer" })
  quantity: number;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: "uuid" })
  livroId: string;

  @ManyToOne(() => Sale, sale => sale.items)
  sale: Sale;
}
