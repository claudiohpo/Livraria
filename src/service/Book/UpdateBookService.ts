import { getManager } from "typeorm";
import { BooksRepositories } from "../../repositories/BooksRepositories";
import { CategoriesRepository } from "../../repositories/CategoriesRepository";
import { PriceGroupRepository } from "../../repositories/PriceGroupRepository";
import { Book } from "../../entities/Book";
import { IBookRequest } from "../../Interface/IBookInterface";

export class UpdateBookService {
    async execute(id: number, payload: IBookRequest): Promise<Book> {
        const manager = getManager();
        const booksRepo = manager.getCustomRepository(BooksRepositories);
        const categoriesRepo = manager.getCustomRepository(CategoriesRepository);
        const priceGroupsRepo = manager.getCustomRepository(PriceGroupRepository);

        // buscar livro existente com relations necessárias
        const book = await booksRepo.findOne({
            where: { id },
            relations: ["categories", "pricegroup", "images"],
        });

        if (!book) throw new Error(`Book id ${id} não encontrado`);

        // Validar ISBN único (se alterado)
        if (payload.ISBN && payload.ISBN !== book.ISBN) {
            const other = await booksRepo.findOne({ where: { ISBN: payload.ISBN } });
            if (other && other.id !== id) throw new Error(`ISBN ${payload.ISBN} já cadastrado para outro livro`);
            book.ISBN = payload.ISBN;
        }

        // Validar barcode único (se alterado)
        if (payload.barcode && payload.barcode !== (book.barcode || "")) {
            const otherB = await booksRepo.findOne({ where: { barcode: payload.barcode } });
            if (otherB && otherB.id !== id) throw new Error(`Barcode ${payload.barcode} já cadastrado para outro livro`);
            book.barcode = payload.barcode;
        }

        // Atualizar campos simples
        book.author = payload.author ?? book.author;
        book.year = Number(payload.year ?? book.year);
        book.title = payload.title ?? book.title;
        book.publisher = payload.publisher ?? book.publisher;
        book.edition = payload.edition ?? book.edition;
        book.pages = Number(payload.pages ?? book.pages);
        book.synopsis = payload.synopsis ?? book.synopsis;

        // Atualizar dimensões (espera objeto conforme entidade)
        if (payload.dimensions) {
            const dims = payload.dimensions;
            book.dimensions = {
                height: Number(dims.height ?? 1),
                width: Number(dims.width ?? 1),
                depth: Number(dims.depth ?? 1),
                weight: Number(dims.weight ?? 0.1),
            };
        }

        // Atualizar price (usei payload.cost — ajuste se preferir diferente)
        if (payload.cost != null) {
            book.price = Number(payload.cost);
        }

        // PriceGroup: tentar por id (numeric) ou por name (string)
        if (payload.pricegroup) {
            const pgRaw = payload.pricegroup;
            let priceGroupEntity = null;
            const pgAsNumber = Number(pgRaw);
            if (!Number.isNaN(pgAsNumber) && pgAsNumber > 0) {
                priceGroupEntity = await priceGroupsRepo.findOne({ where: { id: pgAsNumber } as any });
            }
            if (!priceGroupEntity) {
                // tentar por nome
                priceGroupEntity = await priceGroupsRepo.findOne({ where: { name: pgRaw } as any });
            }
            if (!priceGroupEntity) {
                throw new Error(`PriceGroup '${pgRaw}' não encontrado`);
            }
            (book as any).pricegroup = priceGroupEntity;
        }
    
        // Se algum ID não existir, lançar erro
        if (Array.isArray(payload.category)) {
            const newCategories: any[] = [];
            for (const catIdRaw of payload.category) {
                const catId = Number(catIdRaw);
                if (!catId || Number.isNaN(catId)) {
                    throw new Error(`Categoria inválida: ${catIdRaw}`);
                }
                const cat = await categoriesRepo.findOne({ where: { id: catId } as any });
                if (!cat) {
                    throw new Error(`Categoria id ${catId} não encontrada`);
                }
                newCategories.push(cat);
            }
            book.categories = newCategories;
        }


        // Salvar e retornar
        const saved = await booksRepo.save(book);
        return saved;
    }
}