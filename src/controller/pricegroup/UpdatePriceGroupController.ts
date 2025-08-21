import { Request, Response } from "express";
import { UpdatePriceGroupService } from "../../service/PriceGroup/UpdatePriceGroupService";

export class UpdatePriceGroupController {
  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const data = request.body;
      const service = new UpdatePriceGroupService();
      const updated = await service.execute(Number(id), data);
      return response.json(updated);
    } catch (error) {
      if (error instanceof Error) return response.status(400).json({ message: error.message });
      return response.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
