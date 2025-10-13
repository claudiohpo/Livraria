import { Request, Response } from "express";
import { GetBookByIdService } from "../../service/Book/GetBookByIdService";

class GetBookByIdController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const service = new GetBookByIdService();

    try {
      const bookId = Number(id);
      const book = await service.execute(bookId);
      return response.status(200).json(book);
    } catch (err: any) {
      if (err instanceof Error) {
        const msg = err.message.toLowerCase();
        if (msg.includes("não encontrado") || msg.includes("not found")) {
          return response.status(404).json({ message: err.message });
        }
        return response.status(400).json({ message: err.message });
      }
      return response.status(500).json({ message: "Erro interno do Servidor" });
    }
  }
}

export { GetBookByIdController };