import { getCustomRepository, getRepository } from "typeorm";
import { CartsRepositories } from "../../repositories/CartsRepositories";
import { IUpdateCartRequest } from "../../Interface/ICartInterface";
import { Cart } from "../../entities/Cart";

export class UpdateCartService {
  async execute(cartId: string, data: IUpdateCartRequest) {
    if (!cartId) throw new Error("cartId is required");
    const cartsRepo = getCustomRepository(CartsRepositories);
    const cart = await cartsRepo.findOne(cartId);
    if (!cart) throw new Error("Cart not found");

    if (data.active !== undefined) cart.active = data.active;
    if (data.appliedDiscount !== undefined) cart.appliedDiscount = Number(data.appliedDiscount);
    if (data.couponAppliedId !== undefined) cart.couponAppliedId = data.couponAppliedId;
    if (data.clienteId !== undefined) cart.clienteId = Number(data.clienteId);

    await cartsRepo.save(cart);
    return cart;
  }
}
