import { Repository, EntityRepository } from "typeorm";
import { CreditCard } from "../entities/CreditCard";

@EntityRepository(CreditCard)
class CreditCardsRepositories extends Repository<CreditCard> {
}

export { CreditCardsRepositories }