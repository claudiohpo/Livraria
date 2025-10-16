import { Request, Response } from "express";
import { UpdateBookService } from "../../service/Book/UpdateBookService";

export class UpdateBookController {
  async handle(req: Request, res: Response) {
    try {
      const id = Number(req.params.id || req.body.id);
      if (!id || Number.isNaN(id)) return res.status(400).json({ error: "Book id inválido" });

      const payload = req.body;
      const svc = new UpdateBookService();
      const updated = await svc.execute(id, payload);

      return res.json(updated);
    } catch (err: any) {
      console.error("UpdateBookController:", err);
      // erros de validação retornam 400
      if (err.message && (err.message.includes("não encontrado") || err.message.includes("já cadastrado"))) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: err.message || "Erro ao atualizar livro" });
    }
  }
}
