import { Request, Response } from "express";
import { ListCartItemService } from "../../service/CartItem/ListCartItemService";

class ListCartItemController {
  async handle(request: Request, response: Response) {
    const { cartId } = request.params;
    const service = new ListCartItemService();
    try {
      const items = await service.execute(cartId);
      return response.json(items);
    } catch (err: any) {
      if (err instanceof Error) return response.status(400).json({ message: err.message });
      return response.status(500).json({ message: "Erro interno do Servidor" });
    }
  }
}

export { ListCartItemController };