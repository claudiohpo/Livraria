import { getManager } from "typeorm";
import { ShipmentQuotesRepositories } from "../../repositories/ShipmentQuotesRepositories";

export class UpdateShipmentQuoteService {
    async execute(id: number, payload: Partial<any>) {
        const repo = getManager().getCustomRepository(ShipmentQuotesRepositories);
        await repo.update(id, payload);
        return await repo.findOne({ where: { id } });
    }
}
