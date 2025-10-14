import { EntityRepository, Repository } from "typeorm";
import { ShipmentQuote } from "../entities/ShipmentQuote";

@EntityRepository(ShipmentQuote)
class ShipmentQuotesRepositories extends Repository<ShipmentQuote> { }

export { ShipmentQuotesRepositories };
