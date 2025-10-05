import { EntityRepository, Repository } from "typeorm";
import { CartItem } from "../entities/CartItem";

@EntityRepository(CartItem)
class CartItemsRepositories extends Repository<CartItem> {
}

export { CartItemsRepositories }