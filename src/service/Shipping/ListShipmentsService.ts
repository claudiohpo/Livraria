import { getManager } from "typeorm";
import { ShipmentsRepositories } from "../../repositories/ShipmentsRepositories";

export class ListShipmentsService {
    async execute(filter: any = {}) {
        const repo = getManager().getCustomRepository(ShipmentsRepositories);
        return await repo.find({ where: filter, order: { created_at: "DESC" } as any });
    }
}
