import { Request, Response } from "express";
import { UpdateSaleService } from "../../service/Checkout/UpdateSaleService";

export class UpdateSaleController {
    async handle(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const payload = request.body;

            const updateSaleService = new UpdateSaleService();
            const result = await updateSaleService.execute({ saleId: Number(id), ...payload });

            return response.status(200).json({
                message: "Venda atualizada com sucesso",
                ...result
            });
        } catch (error: any) {
            if (error.message.includes("Venda não encontrada")) {
                return response.status(404).json({ error: error.message });
            }
            if (error.message.includes("VendaId é obrigatório")) {
                return response.status(422).json({ error: error.message });
            }
            return response.status(400).json({ error: error.message });
        }
    }
}