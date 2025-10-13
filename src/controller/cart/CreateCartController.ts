import { Request, Response } from "express";
import { CreateCartService } from "../../service/Cart/CreateCartService";

class CreateCartController {
  async handle(request: Request, response: Response) {
    const payload = request.body;
    const createCart = new CreateCartService();
    try {
      const cart = await createCart.execute(payload);
      return response.status(201).json(cart);
    } catch (err: any) {
      if (err instanceof Error) return response.status(400).json({ message: err.message });
      return response.status(500).json({ message: "Erro interno do Servidor" });
    }
  }
}

export { CreateCartController };
