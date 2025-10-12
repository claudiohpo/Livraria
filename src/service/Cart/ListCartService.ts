import { getRepository } from "typeorm";
import { Cart } from "../../entities/Cart";

export class ListCartService {
  async execute(clienteId: string, activeOnly: boolean = true) {
    if (!clienteId) throw new Error("clienteId is required");

    const cartRepo = getRepository(Cart);

    const where: any = { clienteId };
    if (activeOnly) where.active = true;

    const carts = await cartRepo.find({
      where,
      relations: ["items"],
      order: { created_at: "DESC" }
    });

    return carts;
  }
}