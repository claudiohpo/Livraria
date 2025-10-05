import { getCustomRepository } from "typeorm";
import { CartsRepositories } from "../../repositories/CartsRepositories";

export class DeleteCartService {
  async execute(cartId: string) {
    if (!cartId) throw new Error("cartId is required");

    const cartsRepo = getCustomRepository(CartsRepositories);
    const cart = await cartsRepo.findOne(cartId);
    if (!cart) throw new Error("Cart not found");

    // Soft delete -> set active false
    cart.active = false;
    await cartsRepo.save(cart);

    return cart;
  }
}
