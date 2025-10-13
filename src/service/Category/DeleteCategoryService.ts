import { getCustomRepository } from "typeorm";
import { CategoriesRepository } from "../../repositories/CategoriesRepository";

export class DeleteCategoryService {
  async execute(id: number): Promise<string> {
    const categoriesRepo = getCustomRepository(CategoriesRepository);

    const category = await categoriesRepo.findOne(id);
    if (!category) {
      throw new Error("Categoria não encontrada.");
    }

    // capture os dados antes de remover
    const categoryId = category.id;
    const categoryName = category.name;

    await categoriesRepo.remove(category);

    return `Categoria ${categoryName} (id: ${categoryId}) removida com sucesso.`;
  }
}