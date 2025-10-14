import { getManager } from "typeorm";
import { ShipmentsRepositories } from "../../repositories/ShipmentsRepositories";

export class GetShipmentService {
    async execute(id: number) {
        const repo = getManager().getCustomRepository(ShipmentsRepositories);
        return await repo.findOne({ where: { id } });
    }
}
