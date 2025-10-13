import { Request, Response } from "express";
import { UpdateCartService } from "../../service/Cart/UpdateCartService";

class UpdateCartController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const payload = request.body;
    const service = new UpdateCartService();
    try {
      const cart = await service.execute(id, payload);
      return response.json(cart);
    } catch (err: any) {
      if (err instanceof Error) return response.status(400).json({ message: err.message });
      return response.status(500).json({ message: "Erro interno do Servidor" });
    }
  }
}

export { UpdateCartController };
