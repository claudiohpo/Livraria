import { Request, Response } from "express";
import { ListSaleByIDService } from "../../service/Checkout/ListSaleByIDService";

export class ListSaleByIDController {
    async handle(req: Request, res: Response) {
        try {
            const idParam = req.params.id || req.query.saleId || req.body.saleId;
            const saleId = Number(idParam);
            if (!saleId || Number.isNaN(saleId)) return res.status(400).json({ error: "saleId inválido" });

            const svc = new ListSaleByIDService();
            const sale = await svc.execute(saleId);
            if (!sale) return res.status(404).json({ error: "Venda não encontrada" });

            return res.json(sale);
        } catch (err: any) {
            console.error("CheckoutGetByIdController:", err);
            return res.status(500).json({ error: err.message || "Erro ao buscar venda" });
        }
    }
}
