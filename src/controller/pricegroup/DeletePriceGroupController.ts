import { Request, Response } from "express";
import { DeletePriceGroupService } from "../../service/PriceGroup/DeletePriceGroupService";

export class DeletePriceGroupController {
  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const service = new DeletePriceGroupService();
      const msg = await service.execute(Number(id));
      return response.status(200).json({ message: msg });
    } catch (error) {
      if (error instanceof Error) return response.status(400).json({ message: error.message });
      return response.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
