import { getCustomRepository } from "typeorm";
import { InventoryRepository } from "../../repositories/InventoryRepositories";
import { IInventoryRequest } from "../../Interface/IInventoryInterface";

//Valida RN0061 (quantidade > 0), RN0062 (Deve haver um custo ), RNF0064 (Data de entrada obrigatória), e cria um registro em estoque.

export class CreateInventoryEntryService {
  async execute(data: IInventoryRequest) {
    const invRepo = getCustomRepository(InventoryRepository);

    if (!data.bookId) throw new Error("ID do livro é obrigatório");
    if (data.quantity === undefined || data.quantity === null) throw new Error("Quantidade é obrigatória");
    if (Number(data.quantity) <= 0) throw new Error("Quantidade deve ser maior que zero");
    if (data.unitCost === undefined || data.unitCost === null) throw new Error("Custo é obrigatório");
    if (!data.entryDate) throw new Error("Data de entrada é obrigatória");

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