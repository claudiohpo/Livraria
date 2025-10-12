import { Request, Response } from "express";
import { CreateSaleService } from "../../service/Checkout/CreateSaleService";

export class CreateCheckoutController {
  async handle(request: Request, response: Response) {
    try {
      const payload = request.body;
      const service = new CreateSaleService();
      const result = await service.execute(payload);
      return response.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) return response.status(400).json({ error: error.message });
      return response.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
