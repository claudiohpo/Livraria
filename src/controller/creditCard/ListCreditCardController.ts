import { Request, Response } from "express";
import { ListCreditCardService } from "../../service/CreditCard/ListCreditCardService";

export class ListCreditCardController {
    async handle(request: Request, response: Response) {
        try {
            const service = new ListCreditCardService();
            const costumerId = request.params.costumerId;
            const coupons = await service.execute(costumerId);
            return response.json(coupons);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({ message: error.message });
            }
            return response.status(500).json({ message: "Erro interno dos servidor" });
        }
    }
}