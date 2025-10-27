import { Request, Response } from 'express';
import { CreateExchangeService } from '../../service/Checkout/CreateExchangeService';

export class CreateExchangeController {
    async handle(req: Request, res: Response) {
        try {
            const { saleId, items, motivo } = req.body;
            const service = new CreateExchangeService();
            const result = await service.execute({ saleId: Number(saleId), items, motivo });
            return res.status(201).json(result);
        } catch (err: any) {
            return res.status(400).json({ error: String(err.message || err) });
        }
    }
}
