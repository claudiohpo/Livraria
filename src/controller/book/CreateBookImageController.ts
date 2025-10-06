import { Request, Response } from "express";
import { CreateBookImageService } from "../../service/BookImage/CreateBookImageService";

class CreateBookImageController {
  async handle(request: Request, response: Response) {
    const { url, caption } = request.body;
    const { bookId } = request.params; // rota /book/:bookId/images

    const createService = new CreateBookImageService();
    try {
      const image = await createService.execute({
        url,
        caption,
        bookId: Number(bookId),
      });
      return response.status(201).json(image);
    } catch (error) {
      if (error instanceof Error) return response.status(400).json({ message: error.message });
      return response.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}

export { CreateBookImageController };
