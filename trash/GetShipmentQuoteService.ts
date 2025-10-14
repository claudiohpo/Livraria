import { getManager } from "typeorm";
import { ShipmentQuotesRepositories } from "../../repositories/ShipmentQuotesRepositories";

export class GetShipmentQuoteService {
    async execute(id: number) {
        const repo = getManager().getCustomRepository(ShipmentQuotesRepositories);
        return await repo.findOne({ where: { id } });
    }
}
