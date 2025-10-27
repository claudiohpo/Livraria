import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { ReturnsRepositories } from '../../repositories/ReturnsRepositories';

export class AuthorizeReturnController {
    async handle(req: Request, res: Response) {
        try {
            const returnId = Number(req.params.id);
            const manager = getManager();
            const repo = manager.getCustomRepository(ReturnsRepositories);
            const ret = await repo.findOne(returnId);
            if (!ret) return res.status(404).json({ error: 'Devolução não encontrada' });

            if ((ret.status || '').toUpperCase() !== 'PENDING') {
                return res.status(400).json({ error: 'Devolução não está em estado autorizável' });
            }

            ret.status = 'AUTHORIZED';
            await repo.save(ret);

            // TODO: instruir logística de recebimento, reestocagem condicional

            return res.status(200).json({ ok: true, returnId: ret.id, status: ret.status });
        } catch (err: any) {
            return res.status(500).json({ error: String(err.message || err) });
        }
    }
}
