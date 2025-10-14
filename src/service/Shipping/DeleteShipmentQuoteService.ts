import { getManager } from "typeorm";
import { ShipmentQuotesRepositories } from "../../repositories/ShipmentQuotesRepositories";

export class DeleteShipmentQuoteService {
    async execute(id: number) {
        const repo = getManager().getCustomRepository(ShipmentQuotesRepositories);
        await repo.delete(id);
    }
}
