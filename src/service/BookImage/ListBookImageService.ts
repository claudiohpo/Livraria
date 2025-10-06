import { getCustomRepository } from "typeorm";
import { BookImagesRepositories } from "../../repositories/BookImagesRepositories";

export class ListBookImagesService {
  // Se bookId for fornecido, lista apenas imagens desse livro.
  async execute(bookId?: number) {
    const imagesRepo = getCustomRepository(BookImagesRepositories);

    if (bookId) {
      return imagesRepo.find({
        where: { book: { id: bookId } },
        relations: ["book"],
        order: { created_at: "DESC" },
      });
    }

    return imagesRepo.find({ relations: ["book"], order: { created_at: "DESC" } });
  }
}
