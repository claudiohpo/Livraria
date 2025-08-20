import { getCustomRepository } from "typeorm";
import { CategoriesRepository } from "../../repositories/CategoriesRepository";

export class ListCategoryService {
  async execute(onlyActive = false) {
    const categoriesRepo = getCustomRepository(CategoriesRepository);

    if (onlyActive) {
      return await categoriesRepo.find({ where: { active: true }, order: { name: "ASC" } });
    }

    return await categoriesRepo.find({ order: { name: "ASC" } });
  }
}
