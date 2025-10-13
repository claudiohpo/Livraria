import { Request, Response } from "express";
import { DeleteCartService } from "../../service/Cart/DeleteCartService";

class DeleteCartController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const service = new DeleteCartService();
    try {
      await service.execute(id);
      return response.status(204).send();
    } catch (err: any) {
      if (err instanceof Error) return response.status(400).json({ message: err.message });
      return response.status(500).json({ message: "Erro interno do Servidor" });
    }
  }
}

export { DeleteCartController };
