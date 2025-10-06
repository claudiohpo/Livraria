import { getRepository } from "typeorm";
import { Book } from "../../entities/Book";

export class GetBookByIdService {
  async execute(idParam: string | number) {
    if (idParam === undefined || idParam === null) {
      throw new Error("ID do livro não informado");
    }

    // se o projeto usa id numérico:
    const idAsNumber = typeof idParam === "string" && /^\d+$/.test(idParam) ? Number(idParam) : undefined;
    const bookRepo = getRepository(Book);

    // Se sua entidade usa number (PrimaryGeneratedColumn) busque por number,
    // caso use uuid/string, passe a string diretamente.
    const where = idAsNumber !== undefined ? { id: idAsNumber } : { id: idParam };

    const book = await bookRepo.findOne({
      where,
      // relations: ["categories", "priceGroup", "images"] // opcional: descomente se quiser trazer relações
    });

    if (!book) {
      const msg = `Livro não encontrado com id: ${idParam}`;
      // use um tipo de erro custom se preferir
      throw new Error(msg);
    }

    // aqui você pode mapear para um DTO (remover campos sensíveis)
    return {
      id: book.id,
      title: (book as any).title ?? (book as any).titulo ?? (book as any).name ?? null,
      author: (book as any).author ?? null,
      isbn: (book as any).ISBN ?? (book as any).isbn ?? null,
      year: (book as any).year ?? (book as any).ano ?? null,
      pages: (book as any).pages ?? null,
      price: (book as any).valorVenda ?? (book as any).price ?? null,
      active: (book as any).active ?? (book as any).ativo ?? true,
      // adicione outras propriedades que deseja retornar...
    };
  }
}
