import { Request, Response } from "express";
import { DeleteBookImageService } from "../../service/BookImage/DeleteBookImageService";

class DeleteBookImageController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const deleteService = new DeleteBookImageService();

    try {
      const result = await deleteService.execute(Number(id));
      return response.json(result);
    } catch (error) {
      if (error instanceof Error) return response.status(400).json({ message: error.message });
      return response.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}

export { DeleteBookImageController };
