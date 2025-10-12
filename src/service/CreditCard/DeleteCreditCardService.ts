import { getCustomRepository } from "typeorm";
import { CreditCardsRepositories } from "../../repositories/CreditCardsRepositories";

export class DeleteCreditCardService {
    // exclui cartão por id
    async execute(id: number) {
        const creditCardRepo = getCustomRepository(CreditCardsRepositories);
        const creditCard = await creditCardRepo.findOne(id);
        if (!creditCard) throw new Error("Cartão de Crédito não encontrado");

        await creditCardRepo.remove(creditCard);
        return `Cartão de Crédito com id ${id} removido com sucesso`;
    }
}