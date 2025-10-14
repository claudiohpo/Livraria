import { Request, Response } from "express";
import { UpdateShipmentQuoteService } from "../../service/Shipping/UpdateShipmentQuoteService";

export class UpdateShipmentQuoteController {
    async handle(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const svc = new UpdateShipmentQuoteService();
            const updated = await svc.execute(id, req.body);
            return res.json(updated);
        } catch (err: any) {
            console.error("UpdateShipmentQuoteController:", err);
            return res.status(500).json({ error: err.message || String(err) });
        }
    }
}
