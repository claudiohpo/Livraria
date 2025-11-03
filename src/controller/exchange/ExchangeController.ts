import { Request, Response } from 'express';
import { ConfirmExchangeService } from '../../service/Exchange/ConfirmExchangeService';

class ExchangeController {
  async confirmReceive(request: Request, response: Response) {
    const { id } = request.params;
    const { returnToStock } = request.body; // boolean

    try {
      const service = new ConfirmExchangeService();
      const result = await service.execute({ exchangeId: parseInt(id, 10), returnToStock: !!returnToStock });
      return response.status(200).json(result);
    } catch (err: any) {
      return response.status(400).json({ error: err.message || 'Erro' });
    }
  }
}

export { ExchangeController };