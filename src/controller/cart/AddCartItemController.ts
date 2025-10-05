import { Request, Response } from "express";
import { AddCartItemService } from "../../service/Cart/AddCartItemService";

class AddCartItemController {
  async handle(request: Request, response: Response) {
    const { cartId } = request.params;
    const { itemId, quantity, price } = request.body;
    const service = new AddCartItemService();
    try {
      const item = await service.execute({
        cartId: Number(cartId),
        itemId: Number(itemId),
        quantity: Number(quantity),
        price: Number(price)
      });
      return response.status(201).json(item);
    } catch (err: any) {
      if (err instanceof Error) return response.status(400).json({ message: err.message });
      return response.status(500).json({ message: "Internal server error" });
    }
  }
}

export { AddCartItemController };
