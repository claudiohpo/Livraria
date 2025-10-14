import { Request, Response } from "express";
import { ShippingService } from "../../service/Shipping/ShippingService";

export class SelectShippingController {
    async handle(req: Request, res: Response) {
        try {
            const { saleId, quoteId, serviceId } = req.body;
            if (!saleId || !quoteId || !serviceId) return res.status(400).json({ error: "saleId, quoteId e serviceId são obrigatórios" });

            const svc = new ShippingService();
            const result = await svc.createShipmentFromQuote({ saleId: Number(saleId), quoteId: Number(quoteId), serviceId });
            return res.json(result);
        } catch (err: any) {
            console.error("SelectShippingController:", err);
            return res.status(500).json({ error: err.message || "Erro ao selecionar serviço" });
        }
    }
}
