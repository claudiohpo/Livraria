import { getRepository } from "typeorm";
import { Book } from "../../entities/Book";

export class GetBookByIdService {
  async execute(id: number) {
    if (!id || isNaN(Number(id))) {
      throw new Error("ID do livro inválido ou não informado");
    }

    const bookRepo = getRepository(Book);

    const book = await bookRepo.findOne({
      where: { id },
      relations: ["categories", "pricegroup", "images"]
    });

    if (!book) {
      throw new Error(`Livro não encontrado com id: ${id}`);
    }

    return {
      id: book.id,
      title: (book as any).title ?? null,
      author: (book as any).author ?? null,
      categories: (book as any).categories ?? null,
      year: (book as any).year ?? null,
      publisher: (book as any).publisher ?? null,
      edition: (book as any).edition ?? null,
      ISBN: (book as any).ISBN ?? (book as any).isbn ?? null,
      pages: (book as any).pages ?? null,
      synopsis: (book as any).synopsis ?? null,
      dimensions: (book as any).dimensions ?? {
        height: (book as any).height ?? null,
        width: (book as any).width ?? null,
        depth: (book as any).depth ?? null,
        weight: (book as any).weight ?? null,
      },
      pricegroup: (book as any).pricegroup ?? null,
      barcode: (book as any).barcode ?? null,
      cost: (book as any).cost ?? null,
      price: (book as any).price ?? (book as any).valorVenda ?? null,
      active: (book as any).active ?? (book as any).ativo ?? true,
      created_at: (book as any).created_at ?? null,
      updated_at: (book as any).updated_at ?? null,
    };
  }
}