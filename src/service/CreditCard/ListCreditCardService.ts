import { getRepository } from "typeorm";
import { CreditCard } from "../../entities/CreditCard";

export class ListCreditCardService {
    async execute(costumerId: string) {
        const creditCardRepo = getRepository(CreditCard);
        const creditCards = await creditCardRepo.find({
            where: { costumer: { id: costumerId } }
            // relations: ["costumer"]
        });
        return creditCards;
    }
}  