import { Request, Response } from "express";
import { ListPriceGroupService } from "../../service/PriceGroup/ListPriceGroupService";

export class ListPriceGroupController {
  async handle(request: Request, response: Response) {
    try {
      const onlyActive = request.query.onlyActive === "true";
      const service = new ListPriceGroupService();
      const groups = await service.execute(onlyActive);
      return response.json(groups);
    } catch (error) {
      if (error instanceof Error) return response.status(400).json({ message: error.message });
      return response.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
