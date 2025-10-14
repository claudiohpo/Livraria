import { Request, Response } from "express";
import { GetShipmentService } from "../../service/Shipping/GetShipmentService";

export class GetShipmentController {
    async handle(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const svc = new GetShipmentService();
            const item = await svc.execute(id);
            if (!item) return res.status(404).json({ error: "Shipment not found" });
            return res.json(item);
        } catch (err: any) {
            console.error("GetShipmentController:", err);
            return res.status(500).json({ error: err.message || String(err) });
        }
    }
}
