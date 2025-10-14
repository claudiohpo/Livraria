import { getManager } from "typeorm";
import { ShipmentsRepositories } from "../../repositories/ShipmentsRepositories";

export class DeleteShipmentService {
    async execute(id: number) {
        const repo = getManager().getCustomRepository(ShipmentsRepositories);
        await repo.delete(id);
    }
}
