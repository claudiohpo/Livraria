import { getManager } from "typeorm";
import { ShipmentQuotesRepositories } from "../../repositories/ShipmentQuotesRepositories";

export class ListShipmentQuotesService {
    async execute() {
        const repo = getManager().getCustomRepository(ShipmentQuotesRepositories);
        return await repo.find({ order: { created_at: "DESC" } as any });
    }
}
