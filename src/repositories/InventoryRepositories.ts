import { EntityRepository, Repository } from "typeorm";
import { Inventory } from "../entities/Inventory";

@EntityRepository(Inventory)
class InventoryRepository extends Repository<Inventory> {}

export { InventoryRepository };