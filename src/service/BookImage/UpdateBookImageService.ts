import { getCustomRepository } from "typeorm";
import { BookImagesRepositories } from "../../repositories/BookImagesRepositories";
import { IBookImageRequest } from "../../Interface/IBookImageInterface";

export class UpdateBookImageService {
  // atualiza url e/ou caption de uma imagem
  async execute(data: IBookImageRequest) {
    const { id, url, caption } = data;
    if (!id) throw new Error("Image id is required");

    const imagesRepo = getCustomRepository(BookImagesRepositories);
    const image = await imagesRepo.findOne(id, { relations: ["book"] });
    if (!image) throw new Error("Image not found");

    image.url = url ?? image.url;
    image.caption = caption ?? image.caption;

    await imagesRepo.save(image);
    return image;
  }
}
