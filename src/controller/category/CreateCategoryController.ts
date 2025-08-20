import { Request, Response } from "express";
import { CreateCategoryService } from "../../service/Category/CreateCategoryService";

export class CreateCategoryController {
  async handle(request: Request, response: Response) {
    try {
      const { name, description, active } = request.body;
      const service = new CreateCategoryService();
      const category = await service.execute({ name, description, active });
      return response.status(201).json(category);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ message: error.message });
      }
      return response.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
