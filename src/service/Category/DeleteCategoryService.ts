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

    // Se desejar, verifique vínculos com livros aqui antes de remover.
    await categoriesRepo.remove(category);

    // montar a mensagem sem aspas internas para evitar escapes no JSON
    return `Categoria ${categoryName} (id: ${categoryId}) removida com sucesso.`;
  }
}