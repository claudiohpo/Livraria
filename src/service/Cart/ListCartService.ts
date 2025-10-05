import { getRepository } from "typeorm";
import { Cart } from "../../entities/Cart";

export class ListCartService {
  async execute(filter?: { clienteId?: string; activeOnly?: boolean }) {
    const cartRepo = getRepository(Cart);

    const where: any = {};
    if (filter?.clienteId) where.clienteId = filter.clienteId;
    if (filter?.activeOnly === undefined || filter?.activeOnly === true) where.active = true;

    const carts = await cartRepo.find({ where, relations: ["items"], order: { created_at: "DESC" } });
    return carts;
  }
}
