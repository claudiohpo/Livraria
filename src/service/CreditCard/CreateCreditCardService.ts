import { getCustomRepository } from "typeorm";
import { CreditCardsRepositories } from "../../repositories/CreditCardsRepositories";
import { ICreditCardRequest } from "../../Interface/ICreditCardInterface";
import { Costumer } from "../../entities/Costumer";

export class CreateCreditCardService {
    // async execute(data: ICreditCardRequest, costumer: Costumer[]) {
    async execute(data: ICreditCardRequest, costumer: Costumer) {
        const creditCardRepo = getCustomRepository(CreditCardsRepositories);

        const creditCard = creditCardRepo.create({
            cardNumber: data.cardNumber,
            cardHolderName: data.cardHolderName,
            cardExpirationDate: new Date(data.cardExpirationDate),
            cardCVV: data.cardCVV,
            cardBrand: data.cardBrand,
            preferredCard: Boolean(data.preferredCard),
            // costumer: Array.isArray(costumer) ? costumer[0] : costumer,
            costumer: costumer,
        });

        await creditCardRepo.save(creditCard);
        return creditCard;
    }
}