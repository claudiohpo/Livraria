// import { getManager } from "typeorm";
// import { ExchangesRepositories } from "../../repositories/ExchangesRepositories";
// import { ExchangeItem } from "../../entities/ExchangeItem";
// import { InventoryRepository } from "../../repositories/InventoryRepositories";
// import { SalesRepositories } from "../../repositories/SalesRepositories";
// import { SaleItem } from "../../entities/SaleItem";


// export class ConfirmExchangeService {
//   async execute({ exchangeId, returnToStock }: { exchangeId: number; returnToStock: boolean }) {
//     if (!exchangeId) throw new Error("exchangeId é obrigatório");

//     return await getManager().transaction(async tx => {
//       const exchangesRepo = tx.getCustomRepository(ExchangesRepositories);
//       const invRepo = tx.getCustomRepository(InventoryRepository);
//       const salesRepo = tx.getCustomRepository(SalesRepositories);

//       const exchange = await exchangesRepo.findOne(exchangeId, { relations: ["items"] });
//       if (!exchange) throw new Error("Troca não encontrada");

//       // Atualiza status e data de recebimento
//       exchange.status = "TROCADO";
//       exchange.dataRecebimento = new Date();
//       await exchangesRepo.save(exchange);

//       if (returnToStock) {
//         for (const item of exchange.items) {
//           // Aqui você precisa mapear vendaItemId -> bookId
//           // Supondo que ExchangeItem tenha relação com SaleItem
//           // const saleItem = await tx.getRepository("SaleItem").findOne(item.vendaItemId) as any;
//           const saleItem = await tx.getRepository(SaleItem).findOne(item.vendaItemId);

//           if (!saleItem || !saleItem.bookId) continue;

//           // Reentrada em estoque
//           let invEntry = await invRepo.findOne({ where: { bookId: saleItem.bookId } });
//           if (!invEntry) {
//             invEntry = invRepo.create({
//               bookId: saleItem.bookId,
//               quantity: 0,
//               createdAt: new Date()
//             });
//           }
//           invEntry.quantity += item.quantidade;
//           await invRepo.save(invEntry);
//         }
//       }

//       // Atualiza também a venda associada
//       if (exchange.vendaId) {
//         const sale = await salesRepo.findOne(exchange.vendaId);
//         if (sale) {
//           sale.status = "TROCADO";
//           await salesRepo.save(sale);
//         }
//       }

//       return { exchangeId: exchange.id, status: exchange.status };
//     });
//   }
// }

import { getManager } from "typeorm";
import { ExchangesRepositories } from "../../repositories/ExchangesRepositories";
import { SalesRepositories } from "../../repositories/SalesRepositories";
import { ExchangeItem } from "../../entities/ExchangeItem";
import { SaleItem } from "../../entities/SaleItem";
import { Inventory } from "../../entities/Inventory";
import { Coupon } from "../../entities/Coupon";

export class ConfirmExchangeService {
  async execute({ exchangeId, returnToStock }: { exchangeId: number; returnToStock: boolean }) {
    if (!exchangeId) throw new Error("exchangeId é obrigatório");

    return await getManager().transaction(async tx => {
      const exchangesRepo = tx.getCustomRepository(ExchangesRepositories);
      const salesRepo = tx.getCustomRepository(SalesRepositories);
      const exchangeItemRepo = tx.getRepository(ExchangeItem);
      const saleItemRepo = tx.getRepository(SaleItem);
      const invRepo = tx.getRepository(Inventory);
      const couponRepo = tx.getRepository(Coupon);

      // carregar troca com itens
      const exchange = await exchangesRepo.findOne(exchangeId, { relations: ["items"] });
      if (!exchange) throw new Error("Troca não encontrada");

      // validar status
      const currentStatus = (exchange.status || "").toUpperCase();
      if (currentStatus !== "EXCHANGE" && currentStatus !== "EM_TROCA") {
        throw new Error(`Troca em status inválido para recebimento: ${exchange.status}`);
      }

      // buscar itens da troca
      const items = exchange.items && exchange.items.length
        ? exchange.items
        : await exchangeItemRepo.find({ where: { trocaId: exchange.id } });

      let totalCupom = 0;

      if (returnToStock) {
        for (const exItem of items) {
          const vendaItem = await saleItemRepo.findOne(exItem.vendaItemId);
          if (!vendaItem) continue;

          // reentrada em estoque
          let invEntry = await invRepo.findOne({ where: { bookId: vendaItem.bookId } });
          if (!invEntry) {
            invEntry = invRepo.create({
              bookId: vendaItem.bookId,
              quantity: 0
            });
          }
          invEntry.quantity += exItem.quantidade;
          await invRepo.save(invEntry);

          // acumular valor para cupom
          totalCupom += (vendaItem.unitPrice ?? 0) * (exItem.quantidade ?? 0);
        }
      }

      // atualizar troca
      exchange.dataRecebimento = new Date();
      exchange.status = "TROCADO";

      if (totalCupom > 0) {
        let clienteId = "0";
        if (exchange.vendaId) {
          const relatedSale = await salesRepo.findOne(exchange.vendaId);
          clienteId = relatedSale && relatedSale.clientId ? String(relatedSale.clientId) : "0";
        }
        const codigo = `TROCA-${Date.now().toString(36)}-${clienteId}`;
        //const codigo = `TROCA-${Date.now().toString(36)}`;
        const cupom = couponRepo.create({
          code: codigo,
          value: totalCupom,
          validity: null,
          used: false,
          type: "EXCHANGE",
          saleUsedId: null
        } as Partial<Coupon>);
        await couponRepo.save(cupom);

        exchange.codigoCupom = codigo;
        exchange.valorCupom = totalCupom;
      }

      await exchangesRepo.save(exchange);

      // atualizar venda associada
      if (exchange.vendaId) {
        const sale = await salesRepo.findOne(exchange.vendaId);
        if (sale) {
          sale.status = "TROCADO";
          await salesRepo.save(sale);
        }
      }

      return {
        exchangeId: exchange.id,
        returnedToStock: !!returnToStock,
        couponValue: totalCupom
      };
    });
  }
}