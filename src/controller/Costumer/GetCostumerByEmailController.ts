import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { CostumersRepositories } from "../../repositories/CostumersRepositories";

function normalizePossibleString(param: unknown): string {
  if (!param) return "";
  if (Array.isArray(param)) return String(param[0]).trim();
  if (typeof param === "string") return param.trim();
  return String(param).trim();
}

export class GetCostumerByEmailController {
  async handle(request: Request, response: Response) {
    try {
      const fromParams = normalizePossibleString(request.params.email);
      const fromQuery = normalizePossibleString(request.query.email);
      const email = fromParams || fromQuery;

      if (!email) {
        return response.status(400).json({ message: "Email é obrigatório" });
      }

      const repo = getCustomRepository(CostumersRepositories);


      const costumer = await repo.createQueryBuilder("c")
        .leftJoinAndSelect("c.addresses", "a")
        .where("c.email = :email", { email })
        .getOne();

      if (!costumer) {
        return response.status(404).json({ message: "Cliente não encontrado" });
      }

      return response.json(costumer);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ message: error.message });
      }
      return response.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
