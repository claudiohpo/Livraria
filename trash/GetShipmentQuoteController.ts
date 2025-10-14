import { Request, Response } from "express";
import { GetShipmentQuoteService } from "../../service/Shipping/GetShipmentQuoteService";

export class GetShipmentQuoteController {
    async handle(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const svc = new GetShipmentQuoteService();
            const item = await svc.execute(id);
            if (!item) return res.status(404).json({ error: "Quote not found" });
            return res.json(item);
        } catch (err: any) {
            console.error("GetShipmentQuoteController:", err);
            return res.status(500).json({ error: err.message || String(err) });
        }
    }
}
