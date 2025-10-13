import { Request, Response } from "express";
import { UpdateBookImageService } from "../../service/BookImage/UpdateBookImageService";

class UpdateBookImageController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { url, caption } = request.body;

    const updateService = new UpdateBookImageService();
    try {
      const image = await updateService.execute({
        id: Number(id),
        url,
        caption,
        bookId: 0, // não utilizado no update, mas necessário para a tipagem
      });
      return response.json(image);
    } catch (error) {
      if (error instanceof Error) return response.status(400).json({ message: error.message });
      return response.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}

export { UpdateBookImageController };
