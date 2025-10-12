import { getCustomRepository, getManager } from "typeorm";
import { CartItemsRepositories } from "../../repositories/CartItemsRepositories";
import { InventoryRepository } from "../../repositories/InventoryRepositories";
import { InventoryReservationsRepository } from "../../repositories/InventoryReservationsRepository";
import { ICartItemRequest } from "../../Interface/ICartItemInterface";
/**
 * Quando aumentar quantidade -> tenta reservar mais (FIFO)
 * Quando diminuir -> libera reservas (do mais recente reservado para o mais antigo)
 */



export class UpdateCartItemService {
  public async execute({ cartId, itemId: itemId, quantity }: ICartItemRequest) {
    if (!quantity || quantity <= 0) throw new Error("Quantity must be > 0");

    return await getManager().transaction(async manager => {
      const itemsRepo = manager.getCustomRepository(CartItemsRepositories);
      const invRepo = manager.getCustomRepository(InventoryRepository);
      const resRepo = manager.getCustomRepository(InventoryReservationsRepository);

      const item = await itemsRepo.findOne({ where: { id: itemId, cartId } as any });
      if (!item) throw new Error("Cart item not found");

      const diff = quantity - Number(item.quantity);

      if (diff === 0) return item;

      if (diff > 0) {
        // need to reserve additional units FIFO from inventory
        const availableRows = await invRepo.find({ where: { bookId: item.bookId }, order: { entryDate: "ASC" } as any });
        let availableTotal = availableRows.reduce((s, r) => s + Number(r.quantity), 0);
        if (availableTotal < diff) throw new Error("Not enough stock to increase quantity");

        let toReserve = diff;
        for (const row of availableRows) {
          if (toReserve <= 0) break;
          if (row.quantity <= 0) continue;
          const take = Math.min(toReserve, Number(row.quantity));
          row.quantity = Number(row.quantity) - take;
          await invRepo.save(row);

          const reservation = resRepo.create({
            inventoryId: row.id,
            cartItemId: item.id,
            quantity: take,
            expiresAt: null
          } as any);
          await resRepo.save(reservation);
          toReserve -= take;
        }
      } else {
        // diff < 0 -> need to release |diff| units back to inventory
        let toRelease = Math.abs(diff);
        // fetch reservations for this item in LIFO (release most recently reserved first)
        const reservations = await resRepo.find({ where: { cartItemId: item.id }, order: { createdAt: "DESC" } as any });
        for (const r of reservations) {
          if (toRelease <= 0) break;
          const releaseQty = Math.min(r.quantity, toRelease);
          // update inventory row
          const inv = await invRepo.findOne(r.inventoryId);
          if (inv) {
            inv.quantity = Number(inv.quantity) + releaseQty;
            await invRepo.save(inv);
          }
          // update or delete reservation
          if (r.quantity > releaseQty) {
            r.quantity = Number(r.quantity) - releaseQty;
            await resRepo.save(r);
          } else {
            await resRepo.remove(r);
          }
          toRelease -= releaseQty;
        }
      }

      item.quantity = quantity;
      item.updated_at = new Date();
      await itemsRepo.save(item);
      return item;
    });
  }
}
