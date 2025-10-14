import { Request, Response } from "express";
import { UpdateShipmentService } from "../../service/Shipping/UpdateShipmentService";

export class UpdateShipmentController {
    async handle(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const svc = new UpdateShipmentService();
            const updated = await svc.execute(id, req.body);
            return res.json(updated);
        } catch (err: any) {
            console.error("UpdateShipmentController:", err);
            return res.status(500).json({ error: err.message || String(err) });
        }
    }
}
