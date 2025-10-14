import { Request, Response } from "express";
import { CreateShipmentService } from "../../service/Shipping/CreateShipmentService";

export class CreateShipmentController {
    async handle(req: Request, res: Response) {
        try {
            const svc = new CreateShipmentService();
            const created = await svc.execute(req.body);
            return res.status(201).json(created);
        } catch (err: any) {
            console.error("CreateShipmentController:", err);
            return res.status(500).json({ error: err.message || String(err) });
        }
    }
}
