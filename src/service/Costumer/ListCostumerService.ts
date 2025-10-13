import { getCustomRepository } from "typeorm";
import { CostumersRepositories } from "../../repositories/CostumersRepositories";

export class ListCostumerService {
    async execute(onlyActive = false) {
        const costumersRepo = getCustomRepository(CostumersRepositories);

        if (onlyActive) {
            return await costumersRepo.find({ where: { active: true }, order: { name: "ASC" } });
        }
        return await costumersRepo.find({ order: { name: "ASC" } });
    }
}