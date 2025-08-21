import { getCustomRepository } from "typeorm";
import { PriceGroupRepository } from "../../repositories/PriceGroupRepository";
import { BooksRepositories } from "../../repositories/BooksRepositories";

export class DeletePriceGroupService {
  async execute(id: number): Promise<string> {
    const repo = getCustomRepository(PriceGroupRepository);
    const booksRepo = getCustomRepository(BooksRepositories);

    const group = await repo.findOne(id);
    if (!group) throw new Error("Grupo de precificação não encontrado.");

    // evita remoção se existirem livros associados
    // assumimos que TypeORM criou a coluna pricegroupId em books
    const linkedCount = await booksRepo
      .createQueryBuilder("book")
      .leftJoin("book.pricegroup", "pg")
      .where("pg.id = :id", { id })
      .getCount();

    if (linkedCount > 0) {
      throw new Error(`Não é possível remover: existem ${linkedCount} livro(s) associados a este grupo.`);
    }

    // capture name e id antes de remover (para evitar 'undefined' depois)
    const groupId = group.id;
    const groupName = group.name;
    
    await repo.remove(group);
    return `Grupo de precificação ${groupName} (id: ${groupId}) removido com sucesso.`;
  }
}
