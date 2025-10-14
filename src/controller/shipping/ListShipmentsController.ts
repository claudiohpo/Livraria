import { Request, Response } from "express";
import { ListShipmentsService } from "../../service/Shipping/ListShipmentsService";

export class ListShipmentsController {
    async handle(req: Request, res: Response) {
        try {
            const svc = new ListShipmentsService();
            const items = await svc.execute(req.query || {});
            return res.json(items);
        } catch (err: any) {
            console.error("ListShipmentsController:", err);
            return res.status(500).json({ error: err.message || String(err) });
        }
    }
}
