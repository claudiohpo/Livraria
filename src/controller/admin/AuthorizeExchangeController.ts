import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { ExchangesRepositories } from '../../repositories/ExchangesRepositories';

export class AuthorizeExchangeController {
  async handle(req: Request, res: Response) {
    try {
      const exchangeId = Number(req.params.id);
      const manager = getManager();
      const repo = manager.getCustomRepository(ExchangesRepositories);
      const ex = await repo.findOne(exchangeId);
      if (!ex) return res.status(404).json({ error: 'Troca não encontrada' });

      if ((ex.status || '').toUpperCase() !== 'EXCHANGE' && (ex.status || '').toUpperCase() !== 'PENDING') {
        return res.status(400).json({ error: 'Troca não está em estado autorizável' });
      }

      ex.status = 'EXCHANGE_AUTHORIZED';
      ex.dataAutorizacao = new Date();
      await repo.save(ex);

      return res.status(200).json({ ok: true, exchangeId: ex.id, status: ex.status });
    } catch (err: any) {
      return res.status(500).json({ error: String(err.message || err) });
    }
  }
}
