import { Request, Response } from "express";
import { ListShipmentQuotesService } from "../../service/Shipping/ListShipmentQuotesService";

export class ListShipmentQuotesController {
    async handle(req: Request, res: Response) {
        try {
            const svc = new ListShipmentQuotesService();
            const items = await svc.execute();
            return res.json(items);
        } catch (err: any) {
            console.error("ListShipmentQuotesController:", err);
            return res.status(500).json({ message: err.message || "Erro" });
        }
    }
}
