import { Request, Response } from "express";
import { ListExchangesService } from "../../service/Checkout/ListExchangesService";

export class ListExchangesController {
  async handle(req: Request, res: Response) {
    try {
      const filter: any = {};
      if (req.query.status) filter.status = String(req.query.status);
      if (req.query.vendaId) filter.vendaId = Number(req.query.vendaId);

      const svc = new ListExchangesService();
      const list = await svc.execute(filter);
      return res.json(list);
    } catch (err: any) {
      console.error("ListExchangesController:", err);
      return res.status(500).json({ error: err.message || "Erro ao listar trocas" });
    }
  }
}
