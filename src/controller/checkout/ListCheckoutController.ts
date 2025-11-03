import { Request, Response } from "express";
import { ListSaleService } from "../../service/Checkout/ListSaleService";

export class ListCheckoutController {
  async handle(req: Request, res: Response) {
    try {

      const filter: any = {};
      if (req.query.clientId) filter.clientId = Number(req.query.clientId);
      if (req.query.status) filter.status = String(req.query.status);

      const svc = new ListSaleService();
      const list = await svc.execute(filter);
      return res.json(list);
    } catch (err: any) {
      console.error("CheckoutListController:", err);
      return res.status(500).json({ error: err.message || "Erro ao listar vendas" });
    }
  }
}
