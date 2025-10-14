import { Request, Response } from "express";
import { DeleteShipmentQuoteService } from "../../service/Shipping/DeleteShipmentQuoteService";

export class DeleteShipmentQuoteController {
    async handle(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const svc = new DeleteShipmentQuoteService();
            await svc.execute(id);
            return res.status(204).send();
        } catch (err: any) {
            console.error("DeleteShipmentQuoteController:", err);
            return res.status(500).json({ error: err.message || String(err) });
        }
    }
}
