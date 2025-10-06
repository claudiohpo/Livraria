import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn,} from "typeorm";
import { Book } from "./Book";

@Entity("imagens_livros") // nome da tabela conforme modelo relacional
export class BookImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string; // URL da imagem (pode ser externa ou caminho no servidor)

  @Column({ nullable: true, type: "text" })
  caption?: string; // legenda/descrição da imagem

  // relacionamento com livro (FK livro_id)
  @ManyToOne(() => Book, (book) => book.images, { onDelete: "CASCADE" })
  @JoinColumn({ name: "livro_id" })
  book!: Book;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
