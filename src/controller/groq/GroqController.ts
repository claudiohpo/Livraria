import { Request, Response } from "express";
import { GroqService } from "../../service/Groq/GroqService";

export class GroqController {
    async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { prompt } = req.body;
            const service = new GroqService();
            const result = await service.execute({ prompt });
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message || "Erro ao processar requisição" });
        }
    }
}