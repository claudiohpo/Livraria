import { Request, Response } from 'express';
import { CreateReturnService } from '../../service/Checkout/CreateReturnService';

export class CreateReturnController {
    async handle(req: Request, res: Response) {
        try {
            const { saleId, items, motivo, refundMethod } = req.body;
            const service = new CreateReturnService();
            const result = await service.execute({
                saleId: Number(saleId),
                items,
                motivo,
                refundAllocation: refundMethod
            });
            return res.status(201).json({ message: 'Devolução criada com sucesso', data: result });
        } catch (err: any) {
            return res.status(400).json({ message: 'Falha ao criar devolução', error: String(err.message || err) });
        }
    }
}
