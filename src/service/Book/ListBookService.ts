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

        const where: any = {};
        if (filter?.id) where.id = filter.id;
        if (filter?.author) where.author = filter.author;
        if (filter?.category) where.category = filter.category;
        if (filter?.year) where.year = filter.year;
        if (filter?.title) where.title = filter.title;
        if (filter?.publisher) where.publisher = filter.publisher;
        if (filter?.edition) where.edition = filter.edition;
        if (filter?.ISBN) where.ISBN = filter.ISBN;
        if (filter?.pages) where.pages = filter.pages;
        if (filter?.synopsis) where.synopsis = filter.synopsis;
        if (filter?.dimensions) where.dimensions = filter.dimensions;
        if (filter?.pricegroup) where.pricegroup = filter.pricegroup;
        if (filter?.barcode) where.barcode = filter.barcode;
        if (filter?.cost) where.cost = filter.cost;

        const books = await bookRepo.find({ where, order: { created_at: "DESC" } });
        return books;
    }
}