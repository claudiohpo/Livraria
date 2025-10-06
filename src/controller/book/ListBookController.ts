import { Request, Response } from "express";
import { ListBookService } from "../../service/Book/ListBookService";
import { ParsedQs } from "qs";

class ListBookController {
    async handle(request: Request, response: Response) {
        const { id, author, category, year, title, publisher, edition, ISBN, pages, synopsis, dimensions, pricegroup, barcode, cost } = request.query;
        const service = new ListBookService();
        try {
            const books = await service.execute({
                id: id ? Number(id) : undefined,
                author: author as string | undefined,
                category: category
                    ? (Array.isArray(category)
                        ? (category as (string | ParsedQs)[]).map(item => String(item))
                        : [String(category)])
                    : undefined,
                year: year ? Number(year) : undefined,
                title: title as string | undefined,
                publisher: publisher as string | undefined,
                edition: edition as string | undefined,
                ISBN: ISBN as string | undefined,
                pages: pages ? Number(pages) : undefined,
                synopsis: synopsis as string | undefined,
                dimensions: dimensions ? JSON.parse(dimensions as string) : undefined,
                pricegroup: pricegroup as string | undefined,
                barcode: barcode as string | undefined,
                cost: cost ? Number(cost) : undefined,
            });
            return response.json(books);
        } catch (err: any) {
            if (err instanceof Error) return response.status(400).json({ message: err.message });
            return response.status(500).json({ message: "Internal server error" });
        }
    }
}
export { ListBookController };