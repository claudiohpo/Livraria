import { Request, Response } from "express";
import { DeleteShipmentService } from "../../service/Shipping/DeleteShipmentService";

export class DeleteShipmentController {
    async handle(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const svc = new DeleteShipmentService();
            await svc.execute(id);
            return res.status(204).send();
        } catch (err: any) {
            console.error("DeleteShipmentController:", err);
            return res.status(500).json({ error: err.message || String(err) });
        }
    }
}
