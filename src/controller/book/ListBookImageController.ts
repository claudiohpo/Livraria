import { Request, Response } from "express";
import { ListBookImagesService } from "../../service/BookImage/ListBookImageService";

class ListBookImageController {
  async handle(request: Request, response: Response) {
    const { bookId } = request.params;
    const listService = new ListBookImagesService();

    try {
      const images = await listService.execute(bookId ? Number(bookId) : undefined);
      return response.json(images);
    } catch (error) {
      if (error instanceof Error) return response.status(400).json({ message: error.message });
      return response.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}

export { ListBookImageController };
