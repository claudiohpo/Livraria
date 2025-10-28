import { getCustomRepository } from "typeorm";
import { ExchangesRepositories } from "../../repositories/ExchangesRepositories";

export class ListExchangesService {
    async execute(filter: any = {}) {
        const exchangesRepo = getCustomRepository(ExchangesRepositories);

        const query = exchangesRepo.createQueryBuilder("exchange")
            .leftJoinAndSelect("exchange.items", "items");

        if (filter.status) {
            query.andWhere("exchange.status = :status", { status: filter.status });
        }

        if (filter.vendaId) {
            query.andWhere("exchange.vendaId = :vendaId", { vendaId: filter.vendaId });
        }

        return await query.getMany();
    }
}
