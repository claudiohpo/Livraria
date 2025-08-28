import { Request, Response } from "express";
import { DeleteCostumerService } from "../../service/Costumer/DeleteCostumerService";

export class DeleteCostumerController {
    async handle(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const service = new DeleteCostumerService();

            const msg = await service.execute(Number(id));

            return response.status(200).json({ message: msg });
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({ message: error.message });
            }
            return response.status(500).json({ message: "Internal server error" });
        }
    }
}