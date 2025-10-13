import { getCustomRepository } from "typeorm";
import { CartsRepositories } from "../../repositories/CartsRepositories";

export class DeleteCartService {
  async execute(cartId: string) {
    if (!cartId) throw new Error("cartId é obrigatório");

    const cartsRepo = getCustomRepository(CartsRepositories);
    const cart = await cartsRepo.findOne(cartId);
    if (!cart) throw new Error("Carrinho não encontrado");

    // Soft delete: marcar como inativo
    cart.active = false;
    await cartsRepo.save(cart);

    return cart;
  }
}
