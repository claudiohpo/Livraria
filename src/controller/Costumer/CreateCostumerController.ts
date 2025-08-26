import { Request, Response } from "express";
import { CreateCostumerService } from "../../service/Client/CreateCostumerService";

export class CreateCostumerController {
    async handle(request: Request, response: Response) {
        try {
            const data = request.body;
            const service = new CreateCostumerService();
            const costumer = await service.execute(data);
            return response.status(201).json(costumer);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({ error: error.message });
            }
            return response.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}