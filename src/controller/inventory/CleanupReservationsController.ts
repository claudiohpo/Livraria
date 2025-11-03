import { Request, Response } from "express";
import { CleanupExpiredReservationsService } from "../../service/Inventory/CleanupExpiredReservationsService";

export class CleanupReservationsController {
    async handle(req: Request, res: Response) {
        try {
            const svc = new CleanupExpiredReservationsService();
            const result = await svc.execute();
            return res.json({ ok: true, result });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ ok: false, error: err.message || "Erro ao limpar reservas" });
        }
    }
}
