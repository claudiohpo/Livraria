import { Request, Response } from "express";
import { CreateShipmentFromQuoteService } from "../../service/Shipping/CreateShipmentFromQuoteService";

export class CreateShipmentFromQuoteController {
    async handle(req: Request, res: Response) {
        try {
            const { saleId, quoteId, serviceId } = req.body;
            if (!saleId || !quoteId || !serviceId) return res.status(400).json({ error: "saleId, quoteId and serviceId required" });
            const svc = new CreateShipmentFromQuoteService();
            const result = await svc.execute({ saleId: Number(saleId), quoteId: Number(quoteId), serviceId });
            return res.json(result);
        } catch (err: any) {
            console.error("CreateShipmentFromQuoteController:", err);
            return res.status(500).json({ error: err.message || String(err) });
        }
    }
}
