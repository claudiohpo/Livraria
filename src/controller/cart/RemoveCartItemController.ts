import { Request, Response } from "express";
import { RemoveCartItemService } from "../../service/Cart/RemoveCartItemService";

class RemoveCartItemController {
  async handle(request: Request, response: Response) {
    const { cartId, itemId } = request.params;
    const service = new RemoveCartItemService();
    try {
      await service.execute({ cartId: Number(cartId), itemId: Number(itemId), quantity: 0, price: 0 });
      return response.status(204).send();
    } catch (err: any) {
      if (err instanceof Error) return response.status(400).json({ message: err.message });
      return response.status(500).json({ message: "Internal server error" });
    }
  }
}

export { RemoveCartItemController };
