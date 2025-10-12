import { Request, Response } from "express";
import { ListCreditCardService } from "../../service/CreditCard/ListCreditCardService";

export class ListCreditCardController {
  async byId(request: Request, response: Response) {
    try {
      const { costumerId } = request.params;
      const service = new ListCreditCardService();
      const cards = await service.executeById(costumerId);
      return response.json(cards);
    } catch (error: any) {
      return response.status(400).json({ message: error.message });
    }
  }

  async byEmail(request: Request, response: Response) {
    try {
      const { email } = request.params;
      const service = new ListCreditCardService();
      const cards = await service.executeByEmail(email);
      return response.json(cards);
    } catch (error: any) {
      return response.status(400).json({ message: error.message });
    }
  }
}