import { Request, Response } from "express";
import { GetCartService } from "../../service/Cart/GetCartService";

class GetCartController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const service = new GetCartService();
    try {
      const cart = await service.execute(id);
      return response.json(cart);
    } catch (err: any) {
      if (err instanceof Error) return response.status(404).json({ message: err.message });
      return response.status(500).json({ message: "Erro interno do Servidor" });
    }
  }
}

export { GetCartController };
