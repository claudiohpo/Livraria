import { getCustomRepository } from "typeorm";
import { IBookImageRequest } from "../../Interface/IBookImageInterface";
import { BookImagesRepositories } from "../../repositories/BookImagesRepositories";
import { BooksRepositories } from "../../repositories/BooksRepositories";

export class CreateBookImageService {
  // cria uma imagem e associa ao livro
  async execute(data: IBookImageRequest) {
    const { url, caption, bookId } = data;

    const booksRepo = getCustomRepository(BooksRepositories);
    const book = await booksRepo.findOne(bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    const imagesRepo = getCustomRepository(BookImagesRepositories);
    const image = imagesRepo.create({
      url,
      caption,
      book,
    });

    await imagesRepo.save(image);
    return image;
  }
}
