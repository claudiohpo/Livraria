import { getCustomRepository } from "typeorm";
//import { v4 as uuidv4 } from "uuid";
import { CartsRepositories } from "../../repositories/CartsRepositories";
import { ICreateCartRequest } from "../../Interface/ICartInterface";

export class CreateCartService {
  async execute(data: ICreateCartRequest) {
    const cartsRepo = getCustomRepository(CartsRepositories);

    const cart = cartsRepo.create({
      active: true,
      appliedDiscount: 0,
      couponAppliedId: null,
      clienteId: data.clienteId || null
    } as any);

    await cartsRepo.save(cart);
    return cart;
  }
}
