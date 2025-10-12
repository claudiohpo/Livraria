import { getRepository } from "typeorm";
import { CreditCard } from "../../entities/CreditCard";
import { Costumer } from "../../entities/Costumer";

export class ListCreditCardService {
  async executeById(costumerId: string) {
    const creditCardRepo = getRepository(CreditCard);
    return await creditCardRepo.find({
      where: { costumer: { id: costumerId } }
    });
  }

  async executeByEmail(email: string) {
    const costumerRepo = getRepository(Costumer);
    const costumer = await costumerRepo.findOne({ where: { email } });
    if (!costumer) throw new Error("Cliente não encontrado");

    const creditCardRepo = getRepository(CreditCard);
    return await creditCardRepo.find({
      where: { costumer: { id: costumer.id } }
    });
  }
}