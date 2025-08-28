import { getCustomRepository } from "typeorm";
import { CostumersRepositories  } from "../../repositories/CostumersRepositories";
import { ICostumerRequest } from "../../Interface/ICostumerInterface";

export class UpdateCostumerService {
    async execute(id: number, data: ICostumerRequest): Promise<string> {
        const costumerRepo = getCustomRepository(CostumersRepositories);

        const costumer = await costumerRepo.findOne(id);

        if (!costumer) {
            throw new Error("Cliente não encontrado");
        }

        costumer.name = data.name;
        costumer.email = data.email;

        await costumerRepo.save(costumer);

        return `Cliente ${costumer.name} (id: ${costumer.id}) atualizado com sucesso`;
    }
}

//TO AQUI !!!!!!!!!!!!!!!!!!!!!!!!!!!!