import { Request, Response } from "express";
import { UpdateSaleService } from "../../service/Checkout/UpdateSaleService";

export class UpdateSaleController {
    async handle(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const payload = request.body;
            const updateSaleService = new UpdateSaleService();
            const result = await updateSaleService.execute({ saleId: Number(id), ...payload });
            return response.json(result);
        } catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
