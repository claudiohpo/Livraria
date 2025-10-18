
import { getManager, LessThan } from "typeorm";
import { InventoryReservationsRepository } from "../../repositories/InventoryReservationsRepository";
import { InventoryRepository } from "../../repositories/InventoryRepositories";
import { CartItemsRepositories } from "../../repositories/CartItemsRepositories";
import { CartsRepositories } from "../../repositories/CartsRepositories";

/**
 * Serviço que:
 * - encontra reservas com expiresAt < now
 * - devolve as quantidades ao inventário (inv.quantity += reservation.quantity)
 * - atualiza o CartItem (subtrai quantidade reservada; remove item se chegar a 0)
 * - marca o Cart como inactive se ficar sem itens
 * - remove as reservas expiradas
 *
 * Tudo em TRANSAÇÃO para manter consistência.
 */
export class CleanupExpiredReservationsService {
    async execute() {
        return await getManager().transaction(async transactionalEntityManager => {
            const resRepo = transactionalEntityManager.getCustomRepository(InventoryReservationsRepository);
            const invRepo = transactionalEntityManager.getCustomRepository(InventoryRepository);
            const cartItemsRepo = transactionalEntityManager.getCustomRepository(CartItemsRepositories);
            const cartsRepo = transactionalEntityManager.getCustomRepository(CartsRepositories);

            const now = new Date();

            // buscar reservas expiradas com LessThan
            const expired = await resRepo.find({
                where: { expiresAt: LessThan(now) } as any
            });

            if (!expired || expired.length === 0) return { restored: 0, removed: 0, updatedCartItems: 0, deactivatedCarts: 0 };

            let restoredCount = 0;
            let removedCount = 0;
            let updatedCartItems = 0;
            let deactivatedCarts = 0;

            for (const r of expired) {
                try {
                    // 1) devolver quantidade ao inventário (se existir)
                    const inv = await invRepo.findOne(r.inventoryId);
                    if (inv) {
                        inv.quantity = Number(inv.quantity || 0) + Number(r.quantity || 0);
                        await invRepo.save(inv);
                        restoredCount++;
                    }

                    // 2) ajustar CartItem associado (subtrair quantidade reservada)
                    if (r.cartItemId) {
                        const cartItem = await cartItemsRepo.findOne({ where: { id: r.cartItemId } as any });
                        if (cartItem) {
                            // subtrair a quantidade reservada (r.quantity)
                            const newQty = Number(cartItem.quantity || 0) - Number(r.quantity || 0);
                            if (newQty > 0) {
                                cartItem.quantity = newQty;
                                cartItem.updated_at = new Date();
                                await cartItemsRepo.save(cartItem);
                                updatedCartItems++;
                            } else {
                                // remover o cart item (quantidade ficou zero ou negativa)
                                await cartItemsRepo.remove(cartItem);
                                updatedCartItems++;
                            }

                            // 3) verificar se o carrinho ficou sem items -> desativar o cart
                            const cart = await cartsRepo.findOne(cartItem.cartId, { relations: ["items"] } as any);
                            if (cart) {
                                const itemsCount = (cart.items && cart.items.length) ? cart.items.length : 0;
                                if (itemsCount === 0) {
                                    // marcar inactive (campo active boolean)
                                    (cart as any).active = false;
                                    await cartsRepo.save(cart);
                                    deactivatedCarts++;
                                }
                            }
                        }
                    }

                    // 4) remover a reserva
                    await resRepo.remove(r);
                    removedCount++;
                } catch (e) {
                    // log and continue
                    console.error("Falha ao restaurar reserva", r.id, e);
                }
            }

            return { restored: restoredCount, removed: removedCount, updatedCartItems, deactivatedCarts };
        });
    }
}
