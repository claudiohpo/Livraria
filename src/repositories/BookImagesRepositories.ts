import { EntityRepository, Repository } from "typeorm";
import { BookImage } from "../entities/BookImage";

@EntityRepository(BookImage)
class BookImagesRepositories extends Repository<BookImage> {}

export { BookImagesRepositories };