import { getCustomRepository } from "typeorm";
import { PriceGroupRepository } from "../../repositories/PriceGroupRepository";

export class ListPriceGroupService {
  async execute(onlyActive = false) {
    const repo = getCustomRepository(PriceGroupRepository);
    if (onlyActive) {
      return await repo.find({ where: { active: true }, order: { name: "ASC" } });
    }
    return await repo.find({ order: { name: "ASC" } });
  }
}
