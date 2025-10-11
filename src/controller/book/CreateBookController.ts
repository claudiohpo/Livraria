import { Request, Response } from "express";
import { CreateBookService } from "../../service/Book/CreateBookService";

class CreateBookController {
    async handle(request: Request, response: Response){
        const { id,author, category, year, title, publisher, edition, ISBN, pages, synopsis, dimensions, pricegroup, barcode,cost} = request.body; 
        //Lembrar que nas dimensoes o format deve ser Altura, largura, peso e profundidade | A x L x P x P |
        
        const createBookService = new CreateBookService();
        
        try {
            const product = await createBookService.execute({
                author,
                category,
                year,
                title,
                publisher,
                edition,
                ISBN,
                pages,
                synopsis,
                dimensions,
                pricegroup,
                barcode,
                cost
            });
            return response.status(201).json(product); 
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({ message: error.message });
            }
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}
export { CreateBookController };