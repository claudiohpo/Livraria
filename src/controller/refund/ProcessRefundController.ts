import { Request, Response } from 'express';
import { ProcessRefundService } from '../../service/Refund/ProcessRefundService';

export class ProcessRefundController {
    async handle(req: Request, res: Response) {
        try {
            const refundId = Number(req.params.id);
            const srv = new ProcessRefundService();
            const result = await srv.execute({ refundId });
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(400).json({ error: String(err.message || err) });
        }
    }
}
