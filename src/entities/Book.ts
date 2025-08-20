import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "../entities/Category"; // ajuste o path se seu arquivo estiver em outro lugar
import { PriceGroup } from "../entities/PriceGroup"; // ajuste o path se necessário

@Entity("books")
export class Book {
  // ID sequencial (Postgres SERIAL) — atende sua exigência
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  author!: string;

  // relação N:N com Category (uma lista de categorias)
  @ManyToMany(() => Category, { cascade: false })
  @JoinTable({ name: "books_categories" })
  categories!: Category[];

  @Column()
  year!: number;

  @Column()
  title!: string;

  @Column()
  publisher!: string;

  @Column()
  edition!: string;

  // ISBN único
  @Column({ unique: true })
  ISBN!: string;

  @Column()
  pages!: number;

  @Column("text")
  synopsis!: string;

  // Usamos coluna JSON para guardar as dimensões (height, width, depth, weight)
  @Column({ type: "json" })
  dimensions!: { height: number; width: number; depth: number; weight: number };

  // relação N:1 com PriceGroup
  @ManyToOne(() => PriceGroup, (pg) => pg.id, { eager: true })
  pricegroup!: PriceGroup;

  // código de barras único (se necessário)
  @Column({ unique: true })
  barcode!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  // status para controlar ativação/inativação (padrão ATIVO)
  @Column({ default: "ACTIVE" })
  status!: "ACTIVE" | "INACTIVE";

  @Column({ nullable: true, type: "text" })
  inactivationReason?: string;

  @Column({ nullable: true })
  inactivationCategory?: string;

  @Column({ nullable: true, type: "text" })
  activationReason?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
