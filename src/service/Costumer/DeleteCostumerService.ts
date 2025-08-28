import { getCustomRepository } from "typeorm";
import { CostumersRepositories} from "../../repositories/CostumersRepositories";

export class DeleteCostumerService {
    async execute(id: number): Promise<string> {
        const costumerRepo = getCustomRepository(CostumersRepositories);

        const costumer = await costumerRepo.findOne(id);

        if (!costumer) {
            throw new Error("Cliente não encontrado");
        }

        const costumerId = costumer.id;
        const costumerName = costumer.name;

        await costumerRepo.remove(costumer);

        return `Cliente ${costumerName} (id: ${costumerId}) removido com sucesso`;
    }
}
