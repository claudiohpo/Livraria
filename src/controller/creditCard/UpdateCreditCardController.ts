import { Request, Response } from "express";
import { UpdateCreditCardService } from "../../service/CreditCard/UpdateCreditCardService";

class UpdateCreditCardController {
    async handle(request: Request, response: Response) {
        const { id } = request.params;
        const { cardHolderName, cardNumber, cardExpirationDate, cardCVV, cardBrand, preferredCard } = request.body;

        const updateService = new UpdateCreditCardService();
        try {
            const creditCard = await updateService.execute({
                id: Number(id),
                cardHolderName,
                cardNumber,
                cardExpirationDate,
                cardCVV,
                cardBrand,
                preferredCard,
            });
            return response.json(creditCard);
        } catch (error) {
            if (error instanceof Error) return response.status(400).json({ message: error.message });
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export { UpdateCreditCardController };