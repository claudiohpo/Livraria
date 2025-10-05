import { getRepository } from "typeorm";
import { Inventory } from "../../entities/Inventory";

export class ListInventoryService {
  async execute(filter?: { bookId?: string }) {
    const inventoryRepo = getRepository(Inventory);
    const where: any = {};
    if (filter?.bookId) where.bookId = filter.bookId;
    
    const entries = await inventoryRepo.find({ where, order: { createdAt: "DESC" } });
    return entries;
    }
}
