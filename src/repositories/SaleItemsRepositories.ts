import { EntityRepository, Repository } from "typeorm";
import { SaleItem } from "../entities/SaleItem";

@EntityRepository(SaleItem)
class SaleItemsRepository extends Repository<SaleItem> {}

export { SaleItemsRepository };