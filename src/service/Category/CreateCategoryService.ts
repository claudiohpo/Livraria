import { getCustomRepository } from "typeorm";
import { CategoriesRepository } from "../../repositories/CategoriesRepository";
import { ICategoryRequest } from "../../Interface/ICategoryInterface";

export class CreateCategoryService {
  async execute({ name, description, active }: ICategoryRequest) {
    if (!name || name.trim().length === 0) {
      throw new Error("Nome da categoria é obrigatório.");
    }

    const categoriesRepo = getCustomRepository(CategoriesRepository);

    const exists = await categoriesRepo.findOne({ where: { name } });
    if (exists) {
      throw new Error("Categoria com esse nome já existe.");
    }

    const category = categoriesRepo.create({
      name: name.trim(),
      description: description?.trim(),
      active: active === undefined ? true : Boolean(active),
    });

    await categoriesRepo.save(category);

    return category;
  }
}
