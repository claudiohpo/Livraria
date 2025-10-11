import { getRepository } from "typeorm";
import { CartItem } from "../../entities/CartItem";

export class ListCartItemService {
  async execute(cartId: string) {
    const cartItemRepo = getRepository(CartItem);
    const items = await cartItemRepo.find({ where: { cartId } as any, relations: ["book"] });
    return items;
  }
}