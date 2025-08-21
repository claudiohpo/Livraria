import { Request, Response } from "express";
import { CreatePriceGroupService } from "../../service/PriceGroup/CreatePriceGroupService";

export class CreatePriceGroupController {
  async handle(request: Request, response: Response) {
    try {
      const data = request.body;
      const service = new CreatePriceGroupService();
      const group = await service.execute(data);
      return response.status(201).json(group);
    } catch (error) {
      if (error instanceof Error) return response.status(400).json({ message: error.message });
      return response.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
