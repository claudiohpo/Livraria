import { getManager } from "typeorm";
import { CartItemsRepositories } from "../../repositories/CartItemsRepositories";
import { CartsRepositories } from "../../repositories/CartsRepositories";
import { BooksRepositories } from "../../repositories/BooksRepositories";
import { InventoryRepository } from "../../repositories/InventoryRepositories";
import { InventoryReservationsRepository } from "../../repositories/InventoryReservationsRepository";
import { ICartItemRequest } from "../../Interface/ICartItemInterface";

export class AddCartItemService {
  public async execute({ cartId, itemId, quantity, price }: ICartItemRequest) {
    if (!cartId || !itemId || !quantity || Number(quantity) <= 0) {
      throw new Error("Parâmetros inválidos");
    }

    // normaliza/valida tipos
    const cartIdNum = Number(cartId);
    const itemIdNum = Number(itemId);
    const qty = Number(quantity);
    if (Number.isNaN(cartIdNum) || Number.isNaN(itemIdNum) || Number.isNaN(qty) || qty <= 0) {
      throw new Error("Parâmetros inválidos");
    }

    return await getManager().transaction(async (transactionalEntityManager) => {
      const cartsRepo = transactionalEntityManager.getCustomRepository(CartsRepositories);
      const cartItemsRepo = transactionalEntityManager.getCustomRepository(CartItemsRepositories);
      const bookRepo = transactionalEntityManager.getCustomRepository(BooksRepositories);
      const invRepo = transactionalEntityManager.getCustomRepository(InventoryRepository);
      const resRepo = transactionalEntityManager.getCustomRepository(InventoryReservationsRepository);

      const cart = await cartsRepo.findOne(cartIdNum);
      if (!cart) throw new Error("Carrinho não encontrado");

      const book = await bookRepo.findOne(itemIdNum);
      if (!book) throw new Error("Livro não encontrado");

      // Verificar estoque disponível
      const availableRows = await invRepo.find({
        where: { bookId: itemIdNum } as any,
        order: { entryDate: "ASC" } // ordem FIFO
      });

      const availableTotal = availableRows.reduce((s, r) => s + Number(r.quantity), 0);
      if (availableTotal < qty) throw new Error("Não há estoque suficiente para adicionar ao carrinho");

      // calcular preço
      let priceNum: number;
      if (typeof price !== "undefined" && price !== null) {
        const p = Number(price);
        priceNum = Number.isNaN(p) ? (book && Number((book as any).price) ? Number((book as any).price) : 0) : p;
      } else {
        priceNum = book && Number((book as any).price) ? Number((book as any).price) : 0;
      }

      // Criar ou atualizar o CartItem
      // Relacionar pelo id do carrinho e id do livro (bookId)
      let cartItem = await cartItemsRepo.findOne({
        where: { cart: { id: cartIdNum }, bookId: itemIdNum } as any
      });

      if (!cartItem) {
        // construir objeto e salvar direto (save retorna a entidade criada)
        const newCartItemData: any = {
          cart: { id: cartIdNum },
          bookId: itemIdNum,
          quantity: qty,
          price: priceNum,
          created_at: new Date(),
          updated_at: new Date()
        };
        cartItem = await cartItemsRepo.save(newCartItemData);
      } else {
        cartItem.quantity = Number(cartItem.quantity) + qty;
        // não sobrescrever o preço ao atualizar quantidade, para preservar o preço original no momento da adição
        cartItem.updated_at = new Date();
        await cartItemsRepo.save(cartItem);
      }

      // Reservar o estoque (criar registros em InventoryReservation e decrementar Inventory)
      let toReserve = qty;
      for (const row of availableRows) {
        if (toReserve <= 0) break;
        if (Number(row.quantity) <= 0) continue;

        const take = Math.min(toReserve, Number(row.quantity));

        // decrementar a linha de inventário
        row.quantity = Number(row.quantity) - take;
        await invRepo.save(row);

        // Criar reserva
        const reservationData: any = {
          inventoryId: row.id,
          cartItemId: cartItem.id,
          quantity: take,
          expiresAt: null // TTL / job externo gerencia expiração  *** Implementar no futuro
        };
        await resRepo.save(reservationData);

        toReserve -= take;
      }

      return cartItem;
    });
  }
}