import { Request,Response } from "express";
import { DeleteBookService } from "../../service/Book/DeleteBookService";

class DeleteBookController {
    async handle(request: Request, response: Response) {
        const { id } = request.params;
        const deleteService = new DeleteBookService();

        try {
            const result = await deleteService.execute(Number(id));
            return response.json(result);
        } catch (error) {
            if (error instanceof Error) return response.status(400).json({ message: error.message });
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export { DeleteBookController };