import { getCustomRepository } from "typeorm";
import { CategoriesRepository } from "../../repositories/CategoriesRepository";
import { ICategoryRequest } from "../../Interface/ICategoryInterface";

export class UpdateCategoryService {
  async execute(id: number, { name, description, active }: ICategoryRequest) {
    const categoriesRepo = getCustomRepository(CategoriesRepository);

    const category = await categoriesRepo.findOne(id);
    if (!category) {
      throw new Error("Categoria não encontrada.");
    }

    if (name && name.trim().length > 0 && name !== category.name) {
      // verificar duplicidade de nome
      const other = await categoriesRepo.findOne({ where: { name } });
      if (other && other.id !== category.id) {
        throw new Error("Outra categoria com esse nome já existe.");
      }
      category.name = name.trim();
    }

    if (description !== undefined) {
      category.description = description?.trim() ?? null;
    }

    if (active !== undefined) {
      category.active = Boolean(active);
    }

    await categoriesRepo.save(category);

    return category;
  }
}
