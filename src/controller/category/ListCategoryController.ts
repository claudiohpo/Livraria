import { Request, Response } from "express";
import { ListCategoryService } from "../../service/Category/ListCategoryService";

export class ListCategoryController {
  async handle(request: Request, response: Response) {
    try {
      // opcional: ?onlyActive=true
      const onlyActive = request.query.onlyActive === "true";
      const service = new ListCategoryService();
      const categories = await service.execute(onlyActive);
      return response.json(categories);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ message: error.message });
      }
      return response.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
