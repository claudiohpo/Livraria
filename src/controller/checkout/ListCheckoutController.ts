// import { Request, Response } from "express";
// import { ListSaleService } from "../../service/Checkout/ListSaleService";

// export class ListCheckoutController {
//     async handle(request: Request, response: Response) {
//         try {
//             const service = new ListSaleService();
//             const result = await service.execute();
//             return response.json(result);
//         } catch (error) {
//             if (error instanceof Error) return response.status(400).json({ error: error.message });
//             return response.status(500).json({ error: "Erro interno do servidor" });
//         }
//     }
// }

// src/controller/checkout/CheckoutListController.ts
import { Request, Response } from "express";
import { ListSaleService } from "../../service/Checkout/ListSaleService";

export class ListCheckoutController {
  async handle(req: Request, res: Response) {
    try {
      // aceitar filtros simples via querystring (ex: ?clientId=123)
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
