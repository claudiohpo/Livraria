import { getCustomRepository } from "typeorm";
import { BookImagesRepositories } from "../../repositories/BookImagesRepositories";

export class DeleteBookImageService {
  // exclui imagem por id
  async execute(id: number) {
    const imagesRepo = getCustomRepository(BookImagesRepositories);
    const image = await imagesRepo.findOne(id);
    if (!image) throw new Error("Imagem não encontrada");

    await imagesRepo.remove(image);
    return { message: "Imagem apagada" };
  }
}
