import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { CreateCreditCardService } from "../../service/CreditCard/CreateCreditCardService";
import { CostumersRepositories } from "../../repositories/CostumersRepositories";

export class CreateCreditCardController {
  async handle(request: Request, response: Response) {
    try {
      const data = request.body;
      const costumerId = data.costumerId;
      if (!costumerId) return response.status(400).json({ error: "costumerId is required" });

      const costumersRepo = getCustomRepository(CostumersRepositories);
      const costumer = await costumersRepo.findOne({ where: { id: costumerId } });
      if (!costumer) return response.status(404).json({ error: "Costumer not found" });

      const service = new CreateCreditCardService();
      const card = await service.execute(data, costumer);
      return response.status(201).json(card);
    } catch (error) {
      if (error instanceof Error) return response.status(400).json({ error: error.message });
      return response.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
