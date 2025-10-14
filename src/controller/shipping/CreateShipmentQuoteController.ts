import { Request, Response } from "express";
import { CreateShipmentQuoteService } from "../../service/Shipping/CreateShipmentQuoteService";

export class CreateShipmentQuoteController {
    async handle(req: Request, res: Response) {
        try {
            const svc = new CreateShipmentQuoteService();
            const created = await svc.execute(req.body);
            return res.status(201).json(created);
        } catch (err: any) {
            console.error("CreateShipmentQuoteController:", err);
            if (err instanceof Error) return res.status(400).json({ message: err.message });
            return res.status(500).json({ message: "Erro interno" });
        }
    }
}
