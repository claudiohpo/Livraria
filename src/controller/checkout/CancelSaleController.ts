import { Request, Response } from 'express';
import { CancelSaleService } from '../../service/Checkout/CancelSaleService';

export class CancelSaleController {
    async handle(req: Request, res: Response) {
        try {
            const saleId = Number(req.params.id || req.body.saleId);
            const { reason } = req.body;
            const service = new CancelSaleService();
            const result = await service.execute({ saleId, reason });
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(400).json({ error: String(err.message || err) });
        }
    }
}
