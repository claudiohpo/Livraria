import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, } from "typeorm";
import { Category } from "../entities/Category";
import { PriceGroup } from "../entities/PriceGroup";
import { BookImage } from "./BookImage";

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  author!: string;

  // relação N:N com Category
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

  // Coluna JSON para guardar as dimensões
  @Column({ type: "json" })
  dimensions!: { height: number; width: number; depth: number; weight: number };

  // relação N:1 com PriceGroup
  @ManyToOne(() => PriceGroup, (pg) => pg.id, { eager: true })
  pricegroup!: PriceGroup;

  @OneToMany(() => BookImage, (image) => image.book, { cascade: true, eager: true })
  images!: BookImage[];

  // código de barras único
  @Column({ unique: true }) //verificar se manteremos unico ***
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
