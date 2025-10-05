import { Request, Response } from "express";
import { UpdateCartItemService } from "../../service/Cart/UpdateCartItemService";

class UpdateCartItemController {
  async handle(request: Request, response: Response) {
    const { cartId, itemId } = request.params;
    const { quantity, price } = request.body;
    const service = new UpdateCartItemService();
    try {
      const item = await service.execute({ 
        cartId: Number(cartId), 
        itemId: Number(itemId), 
        quantity, 
        price 
      });
      return response.json(item);
    } catch (err: any) {
      if (err instanceof Error) return response.status(400).json({ message: err.message });
      return response.status(500).json({ message: "Internal server error" });
    }
  }
}

export { UpdateCartItemController };
