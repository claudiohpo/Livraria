import { getCustomRepository } from "typeorm";
import { BooksRepositories } from "../../repositories/BooksRepositories";

export class DeleteBookService {
    async execute(id: number): Promise<string> {
        const bookRepo = getCustomRepository(BooksRepositories);
        
        const book = await bookRepo.findOne(id);
        if (!book) throw new Error("Livro não encontrado");
        
        await bookRepo.remove(book);

        return `Livro id: ${id} - ${book.title}, removido com sucesso`;
    }
}