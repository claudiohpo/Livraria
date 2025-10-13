import { Request, Response } from "express";
import { CreateAddressService } from "../../service/Address/CreateAddressService";
import { getCustomRepository } from "typeorm";
import { CostumersRepositories } from "../../repositories/CostumersRepositories";

export class CreateAddressController {
  async handle(request: Request, response: Response) {
    try {
      const data = request.body;
      const costumerId = data.costumerId;
      if (!costumerId) return response.status(400).json({ error: "costumerId é obrigatório" });

      const costumersRepo = getCustomRepository(CostumersRepositories);
      const costumer = await costumersRepo.findOne({ where: { id: costumerId } });
      if (!costumer) return response.status(404).json({ error: "Cliente não encontrado" });

      const service = new CreateAddressService();
      const address = await service.execute(data, costumer);
      return response.status(201).json(address);
    } catch (error) {
      if (error instanceof Error) return response.status(400).json({ error: error.message });
      return response.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
