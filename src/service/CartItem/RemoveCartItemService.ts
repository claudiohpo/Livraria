import { getCustomRepository, getManager } from "typeorm";
import { CartItemsRepositories } from "../../repositories/CartItemsRepositories";
import { InventoryRepository } from "../../repositories/InventoryRepositories";
import { InventoryReservationsRepository } from "../../repositories/InventoryReservationsRepository";
import { ICartItemRequest } from "../../Interface/ICartItemInterface";


export class RemoveCartItemService {
  public async execute({ cartId, itemId }: ICartItemRequest) {
    return await getManager().transaction(async manager => {
      const itemsRepo = manager.getCustomRepository(CartItemsRepositories);
      const invRepo = manager.getCustomRepository(InventoryRepository);
      const resRepo = manager.getCustomRepository(InventoryReservationsRepository);

      const item = await itemsRepo.findOne({ where: { id: Number(itemId), cartId: Number(cartId) } });
      if (!item) throw new Error("Item do carrinho não encontrado");

      // Procurar reservas associadas ao item do carrinho
      const reservations = await resRepo.find({ where: { cartItemId: item.id } as any });
      for (const r of reservations) {
        // Restaurar estoque no inventário
        const inv = await invRepo.findOne(r.inventoryId);
        if (inv) {
          inv.quantity = Number(inv.quantity) + Number(r.quantity);
          await invRepo.save(inv);
        }
        await resRepo.delete(r.id);
      }

      // Remover o item do carrinho
      await itemsRepo.delete(item.id);
      return {
        message: `Item ${item.id} removido do carrinho ${cartId} com sucesso`,
        removedItem: item
      };

    });
  }
}