import { getCustomRepository } from "typeorm";
//import { v4 as uuidv4 } from "uuid";
import { InventoryRepository } from "../../repositories/InventoryRepositories";
import { IInventoryRequest } from "../../Interface/IInventoryInterface";

/**
 * Valida RN0061 (quantity > 0), RN0062 (unitCost mandatory), RNF0064 (entryDate mandatory),
 * e cria um registro em estoque.
 */

export class CreateInventoryEntryService {
  async execute(data: IInventoryRequest) {
    const invRepo = getCustomRepository(InventoryRepository);

    if (!data.bookId) throw new Error("bookId is required");
    if (data.quantity === undefined || data.quantity === null) throw new Error("quantity is required");
    if (Number(data.quantity) <= 0) throw new Error("quantity must be greater than zero (RN0061)");
    if (data.unitCost === undefined || data.unitCost === null) throw new Error("unitCost is required (RN0062)");
    if (!data.entryDate) throw new Error("entryDate is required (RNF0064)");

    const entry = invRepo.create({
      bookId: data.bookId,
      quantity: Number(data.quantity),
      unitCost: Number(data.unitCost),
      entryDate: new Date(data.entryDate as any),
      invoiceNumber: data.invoiceNumber || null,
      supplierId: data.supplierId || null
    } as any);

    await invRepo.save(entry);

    return entry;
  }
}
