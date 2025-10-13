import { getRepository } from "typeorm";
import { Cart } from "../../entities/Cart";

export class GetCartService {
  async execute(cartId: string) {
    if (!cartId) throw new Error("cartId é obrigatório");

    // carregar os items do carrinho
    const cartRepo = getRepository(Cart);
    const cart = await cartRepo.findOne(cartId, { relations: ["items"] });

    if (!cart) throw new Error("Carrinho não encontrado");
    return cart;
  }
}
