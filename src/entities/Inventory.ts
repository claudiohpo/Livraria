import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "estoque" }) 
export class Inventory {
  @PrimaryGeneratedColumn() 
  id: number;

  @Column({ type: "integer", name: "quantidade" })
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2, name: "custoUnitario" })
  unitCost: string;

  @Column({ type: "date", name: "dataEntrada" })
  entryDate: Date;

  @Column({ type: "varchar", length: 4000, name: "notaFiscal", nullable: true })
  invoiceNumber: string | null;

  @Column({ type: "int", name: "livroId" }) 
  bookId: number;

  @Column({ type: "int", name: "fornecedorId", nullable: true }) 
  supplierId: number | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}