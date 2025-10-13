import { Request, Response } from "express";
import { ListSaleService } from "../../service/Checkout/ListSaleService";

export class ListCheckoutController {
    async handle(request: Request, response: Response) {
        try {
            const service = new ListSaleService();
            const result = await service.execute();
            return response.json(result);
        } catch (error) {
            if (error instanceof Error) return response.status(400).json({ error: error.message });
            return response.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}