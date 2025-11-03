import { getRepository } from "typeorm";
import { Book } from "../../entities/Book";

export class ListBookService {
    async execute(filter?: {
        id?: number;
        author?: string;
        category?: string[];
        year?: number;
        title?: string;
        publisher?: string;
        edition?: string;
        ISBN?: string;
        pages?: number;
        synopsis?: string;
        dimensions?: { height?: number; width?: number; depth?: number; weight?: number; };
        pricegroup?: string;
        barcode?: string;
        cost?: number;
    }) {
        const bookRepo = getRepository(Book);

        // Usar QueryBuilder para suportar joins (categories) e filtros variados
        const qb = bookRepo.createQueryBuilder("book")
            .leftJoinAndSelect("book.categories", "category")
            .leftJoinAndSelect("book.pricegroup", "pricegroup")
            .leftJoinAndSelect("book.images", "images");

        // filtros simples aplicados via where
        if (filter?.id) qb.andWhere("book.id = :id", { id: Number(filter.id) });
        if (filter?.author) qb.andWhere("book.author ILIKE :author", { author: `%${filter.author}%` });
        if (filter?.year) qb.andWhere("book.year = :year", { year: Number(filter.year) });
        if (filter?.title) qb.andWhere("book.title ILIKE :title", { title: `%${filter.title}%` });
        if (filter?.publisher) qb.andWhere("book.publisher ILIKE :publisher", { publisher: `%${filter.publisher}%` });
        if (filter?.edition) qb.andWhere("book.edition ILIKE :edition", { edition: `%${filter.edition}%` });
        if (filter?.ISBN) qb.andWhere("book.\"ISBN\" = :isbn", { isbn: filter.ISBN });
        if (filter?.pages) qb.andWhere("book.pages = :pages", { pages: Number(filter.pages) });
        if (filter?.synopsis) qb.andWhere("book.synopsis ILIKE :synopsis", { synopsis: `%${filter.synopsis}%` });
        if (filter?.barcode) qb.andWhere("book.barcode ILIKE :barcode", { barcode: `%${filter.barcode}%` });
        if (filter?.cost) qb.andWhere("book.cost = :cost", { cost: Number(filter.cost) });
        if (filter?.pricegroup) qb.andWhere("pricegroup.name ILIKE :pg", { pg: `%${filter.pricegroup}%` });

        // filtro por dimensions
        if (filter?.dimensions) {
            const d = filter.dimensions;
            if (typeof d.height !== "undefined") qb.andWhere("book.dimensions->>'height' = :height", { height: String(d.height) });
            if (typeof d.width !== "undefined") qb.andWhere("book.dimensions->>'width' = :width", { width: String(d.width) });
            if (typeof d.depth !== "undefined") qb.andWhere("book.dimensions->>'depth' = :depth", { depth: String(d.depth) });
            if (typeof d.weight !== "undefined") qb.andWhere("book.dimensions->>'weight' = :weight", { weight: String(d.weight) });
        }

        // filtro por categoria (array). Suporta array de nomes ou array de ids (strings/numbers).
        if (filter?.category && Array.isArray(filter.category) && filter.category.length > 0) {
            const cats = filter.category;
            const allNumeric = cats.every(c => !Number.isNaN(Number(c)));
            if (allNumeric) {
                // tratar como ids
                const ids = cats.map(c => Number(c));
                qb.andWhere("category.id IN (:...catIds)", { catIds: ids });
            } else {
                // tratar como nomes (case-insensitive)
                qb.andWhere("category.name IN (:...catNames)", { catNames: cats });
            }
        }

        // ordenar e executar
        qb.orderBy("book.created_at", "DESC");

        const books = await qb.getMany();

        // mapear para o mesmo formato do GetBookByIdService
        const mapped = books.map((book: any) => ({
            id: book.id,
            title: book.title ?? null,
            author: book.author ?? null,
            categories: book.categories ?? [],
            year: book.year ?? null,
            publisher: book.publisher ?? null,
            edition: book.edition ?? null,
            ISBN: book.ISBN ?? null,
            pages: book.pages ?? null,
            synopsis: book.synopsis ?? null,
            dimensions: book.dimensions ?? null,
            pricegroup: book.pricegroup ?? null,
            images: book.images ?? null,
            barcode: book.barcode ?? null,
            cost: (book as any).cost ?? null,
            price: book.price ?? null,
            active: (book.status === "ACTIVE" || (book as any).ativo) ?? true,
            created_at: book.created_at ?? null,
            updated_at: book.updated_at ?? null
        }));

        return mapped;
    }
}
