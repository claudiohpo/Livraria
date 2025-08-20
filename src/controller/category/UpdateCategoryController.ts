import { Request, Response } from "express";
import { UpdateCategoryService } from "../../service/Category/UpdateCategoryService";

export class UpdateCategoryController {
  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { name, description, active } = request.body;
      const service = new UpdateCategoryService();
      const category = await service.execute(Number(id), { name, description, active });
      return response.json(category);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ message: error.message });
      }
      return response.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
