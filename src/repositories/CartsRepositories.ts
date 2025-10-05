import { EntityRepository, Repository } from "typeorm";
import { Cart } from "../entities/Cart";

@EntityRepository(Cart)
class CartsRepositories extends Repository<Cart> {
}

export { CartsRepositories }