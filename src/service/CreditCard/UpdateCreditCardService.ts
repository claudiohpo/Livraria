import { getCustomRepository } from "typeorm";
import { CreditCardsRepositories } from "../../repositories/CreditCardsRepositories";
import { ICreditCardRequest } from "../../Interface/ICreditCardInterface";

export class UpdateCreditCardService {
  // atualiza um cartão de crédito
  async execute(data: ICreditCardRequest) {
    const { id, cardHolderName, cardNumber, cardExpirationDate, cardCVV, cardBrand, preferredCard } = data;
    if (!id) throw new Error("Credit card id is required");
    const creditCardRepo = getCustomRepository(CreditCardsRepositories);
    const creditCard = await creditCardRepo.findOne(id);
    if (!creditCard) throw new Error("Cartão de crédito não encontrado");

    creditCard.cardHolderName = cardHolderName ?? creditCard.cardHolderName;
    creditCard.cardNumber = cardNumber ?? creditCard.cardNumber;
    creditCard.cardExpirationDate = cardExpirationDate
      ? (typeof cardExpirationDate === "string" ? new Date(cardExpirationDate) : cardExpirationDate)
      : creditCard.cardExpirationDate;
    creditCard.cardCVV = cardCVV ?? creditCard.cardCVV;
    creditCard.cardBrand = cardBrand ?? creditCard.cardBrand;
    creditCard.preferredCard = preferredCard ?? creditCard.preferredCard;
    await creditCardRepo.save(creditCard);

    return creditCard;
  }
}