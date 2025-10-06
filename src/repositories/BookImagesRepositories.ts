import { EntityRepository, Repository } from "typeorm";
import { BookImage } from "../entities/BookImage";

@EntityRepository(BookImage)
class BookImagesRepository extends Repository<BookImage> {}

export { BookImagesRepository };