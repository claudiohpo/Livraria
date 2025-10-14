import { getManager } from "typeorm";
import { ShipmentsRepositories } from "../../repositories/ShipmentsRepositories";

export class UpdateShipmentService {
    async execute(id: number, payload: Partial<any>) {
        const repo = getManager().getCustomRepository(ShipmentsRepositories);
        await repo.update(id, payload);
        return await repo.findOne({ where: { id } });
    }
}
