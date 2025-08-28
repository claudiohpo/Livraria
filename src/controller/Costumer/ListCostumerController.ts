import { Request, Response } from "express";
import { ListCostumerService } from "../../service/Costumer/ListCostumerService";

export class ListCostumerController {
    async handle(request: Request, response: Response) {
        try {
            const onlyActive = request.query.onlyActive === "true";
            const service = new ListCostumerService();
            const costumers = await service.execute(onlyActive);
            return response.json(costumers);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({ message: error.message });
            }
            return response.status(500).json({ message: "Erro interno dos servidor" });
        }
    }
}