import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, } from "typeorm";
import { Book } from "./Book";

@Entity("imagens_livros")
export class BookImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string; // URL da imagem 

  @Column({ nullable: true, type: "text" })
  caption?: string;

  // relacionamento com livro (FK livro_id)
  @ManyToOne(() => Book, (book) => book.images, { onDelete: "CASCADE" })
  @JoinColumn({ name: "livro_id" })
  book!: Book;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
