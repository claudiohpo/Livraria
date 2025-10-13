// import { getManager } from "typeorm";
// import { SalesRepositories } from "../../repositories/SalesRepositories";
// import { SaleItemsRepository } from "../../repositories/SaleItemsRepositories";
// import { PaymentsRepository } from "../../repositories/PaymentsRepositories";
// import { CouponsRepositories } from "../../repositories/CouponsRepositories";
// import { InventoryRepository } from "../../repositories/InventoryRepositories";
// import { CartItemsRepositories } from "../../repositories/CartItemsRepositories";
// import { CartsRepositories } from "../../repositories/CartsRepositories";
// import { CreditCardsRepositories } from "../../repositories/CreditCardsRepositories";
// import { PaymentGatewayService } from "../Payment/PaymentGatewayService";

// // Entities (para tipagem)
// import { Sale } from "../../entities/Sale";
// import { Coupon } from "../../entities/Coupon";
// import { Inventory } from "../../entities/Inventory";
// import { SaleItem } from "../../entities/SaleItem";
// import { Payment } from "../../entities/Payment";

// export class CreateSaleService {
//   async execute(payload: {
//     cartId: number;
//     payments: any[];
//     addressId?: number;
//     clientId?: number;
//   }) {
//     const { cartId, payments, addressId, clientId } = payload;
//     if (!cartId) throw new Error("cartId is required");

//     return await getManager().transaction(async transactionalEntityManager => {
//       const cartsRepo = transactionalEntityManager.getCustomRepository(CartsRepositories);
//       const cartItemsRepo = transactionalEntityManager.getCustomRepository(CartItemsRepositories);
//       const salesRepo = transactionalEntityManager.getCustomRepository(SalesRepositories);
//       const saleItemsRepo = transactionalEntityManager.getCustomRepository(SaleItemsRepository);
//       const paymentsRepo = transactionalEntityManager.getCustomRepository(PaymentsRepository);
//       const couponsRepo = transactionalEntityManager.getCustomRepository(CouponsRepositories);
//       const invRepo = transactionalEntityManager.getCustomRepository(InventoryRepository);
//       const cardsRepo = transactionalEntityManager.getCustomRepository(CreditCardsRepositories);

//       const cart = await cartsRepo.findOne({ where: { id: cartId }, relations: ["items"] });
//       if (!cart) throw new Error("Cart not found");
//       if (!cart.items || cart.items.length === 0) throw new Error("Cart has no items");

//       // calcular total dos items usando preços do carrinho (precisa usar cart.items.price se existir)
//       let itemsTotal = 0;
//       for (const it of cart.items) {
//         // preferir price no item do carrinho (preço final em momento de adição)
//         const unitPrice = Number(it.price ?? 0);
//         itemsTotal += +(unitPrice * Number(it.quantity)); // usar + para garantir number
//       }
//       // arredondar para 2 casas
//       itemsTotal = Math.round((itemsTotal + Number.EPSILON) * 100) / 100;

//       const freight = 0;
//       let couponTotal = 0;

//       // Criar entidade Sale — tipada explicitamente como Sale
//       let saleEntity = salesRepo.create({
//         status: "OPEN",
//         freightValue: freight,
//         clientId: clientId || (cart as any).clientId || null,
//         deliveryAddressId: addressId || null,
//         total: itemsTotal,
//         appliedDiscount: couponTotal,
//         couponUsedId: null
//       } as Partial<Sale>) as Sale;

//       saleEntity = await salesRepo.save(saleEntity); // aqui saleEntity é do tipo Sale (não array)

//       // Criar itens da venda
//       for (const it of cart.items) {
//         const si = saleItemsRepo.create({
//           sale: saleEntity,
//           bookId: (it as any).bookId,
//           quantity: it.quantity,
//           unitPrice: (it as any).price || 0
//         } as Partial<SaleItem>) as SaleItem;
//         await saleItemsRepo.save(si);
//       }

//       // Preparar pagamentos
//       const createdPaymentEntities: Array<{ pay: Payment; coupon?: Coupon }> = [];

//       for (const p of payments || []) {
//         if (p.type === "CARD") {
//           let cardEntity = null;
//           if (p.newCard) {
//             // Ajuste dos nomes de campos para combinar com a entidade CreditCard padrão
//             cardEntity = cardsRepo.create({
//               number: p.newCard.cardNumber,
//               holderName: p.newCard.cardHolderName,
//               brand: p.newCard.cardBrand,
//               securityCode: p.newCard.cardCVV,
//               expiry: p.newCard.cardExpirationDate,
//               preferredCard: p.saveCard ? true : false,
//               costumerId: clientId || (cart as any).clientId || null
//             } as any);
//             // Se quiser alteração: salvar somente quando saveCard === true.
//             await cardsRepo.save(cardEntity);
//           }

//           const payEnt = paymentsRepo.create({
//             sale: saleEntity,
//             type: "CARD",
//             value: Number(p.amount),
//             cardId: cardEntity ? cardEntity.id : (p.cardId || null),
//             status: "PENDING"
//           } as Partial<Payment>) as Payment;
//           await paymentsRepo.save(payEnt);
//           createdPaymentEntities.push({ pay: payEnt });
//         } else if (p.type === "COUPON") {
//           if (!p.couponCode) throw new Error("couponCode is required for COUPON payment");

//           // Usar findOne / findOneBy para retornar UMA entidade, não um array
//           const coupon = (await couponsRepo.findOne({ where: { code: p.couponCode } })) as Coupon | null;
//           if (!coupon) throw new Error(`Coupon ${p.couponCode} not found`);
//           if (coupon.used) throw new Error(`Coupon ${p.couponCode} already used`);
//           if (coupon.validity && new Date(coupon.validity) < new Date()) throw new Error(`Coupon ${p.couponCode} expired`);

//           const payEnt = paymentsRepo.create({
//             sale: saleEntity,
//             type: "COUPON",
//             value: Number(p.amount),
//             couponId: coupon.id,
//             status: "PENDING"
//           } as Partial<Payment>) as Payment;
//           await paymentsRepo.save(payEnt);
//           createdPaymentEntities.push({ pay: payEnt, coupon });
//         } else {
//           throw new Error(`Unsupported payment type: ${p.type}`);
//         }
//       }

//       // --- 3) Aplicar cupom(s) ao total da venda ANTES da captura de pagamentos ---
//       // Somar valores dos pagamentos do tipo COUPON informados no payload
//       couponTotal = createdPaymentEntities
//         .filter(c => c.pay.type === "COUPON")
//         .reduce((acc, c) => acc + Number(c.pay.value || 0), 0);

//       // arredondar couponTotal
//       couponTotal = Math.round((couponTotal + Number.EPSILON) * 100) / 100;

//       // Atualizar saleEntity com desconto aplicado e total final
//       saleEntity.appliedDiscount = couponTotal;
//       saleEntity.total = Math.round(((itemsTotal - couponTotal + freight) + Number.EPSILON) * 100) / 100;
//       await salesRepo.save(saleEntity);

//       // --- Validação: somatório dos pagamentos deve bater com saleEntity.total ---
//       const sumPayments = createdPaymentEntities.reduce((acc, c) => acc + Number(c.pay.value || 0), 0);
//       const sumPaymentsRounded = Math.round((sumPayments + Number.EPSILON) * 100) / 100;
//       if (sumPaymentsRounded !== saleEntity.total) {
//         // Reverter marcando pagamentos PENDING -> REJECTED e cancelar venda
//         for (const pEntity of createdPaymentEntities) {
//           pEntity.pay.status = "REJECTED";
//           await paymentsRepo.save(pEntity.pay);
//         }
//         saleEntity.status = "REJECTED";
//         await salesRepo.save(saleEntity);
//         throw new Error(`Sum of payments (${sumPaymentsRounded}) does not match sale total (${saleEntity.total}).`);
//       }

//       // Processar captura via gateway (exemplo)
//       const cardPaymentsToProcess: Array<{ cardId?: string; number?: string; amount: number }> = [];
//       for (const cpe of createdPaymentEntities) {
//         if (cpe.pay.type === "CARD") {
//           cardPaymentsToProcess.push({
//             cardId: cpe.pay.cardId ? String(cpe.pay.cardId) : undefined,
//             amount: Number(cpe.pay.value)
//           });
//         }
//       }

//       const paymentGateway = new PaymentGatewayService();
//       const gwRes = await paymentGateway.captureAll(cardPaymentsToProcess);

//       if (!gwRes.approved) {
//         // marcar pagamentos como REJECTED
//         for (const pEntity of createdPaymentEntities) {
//           pEntity.pay.status = "REJECTED";
//           await paymentsRepo.save(pEntity.pay);
//         }
//         saleEntity.status = "REJECTED";
//         await salesRepo.save(saleEntity);
//         throw new Error("Payment not approved: " + gwRes.message);
//       }

//       // se aprovado -> APPROVED e marcar cupom como usado corretamente
//       for (const pEntity of createdPaymentEntities) {
//         pEntity.pay.status = "APPROVED";
//         await paymentsRepo.save(pEntity.pay);

//         if (pEntity.pay.type === "COUPON" && pEntity.coupon) {
//           // garantir que coupon é entidade e saleEntity é entidade (não array)
//           pEntity.coupon.used = true;
//           // registrar o id da venda que utilizou o cupom
//           pEntity.coupon.saleUsedId = saleEntity.id;
//           await couponsRepo.save(pEntity.coupon);

//           // opcional: setar couponUsedId na venda (se quiser preservar o último usado)
//           saleEntity.couponUsedId = pEntity.coupon.id;
//           await salesRepo.save(saleEntity);
//         }
//       }

//       // Controle de estoque: buscar entradas de inventário pelo bookId e ordenar por createdAt (nome do campo deve bater com sua entity)
//       const saleItems = await saleItemsRepo.find({ where: { sale: saleEntity } as any });
//       for (const it of saleItems) {
//         let remaining = Number((it as any).quantity);

//         // ATENÇÃO: 'createdAt' deve existir na sua entity Inventory; se o nome for 'created_at' ajuste aqui.
//         const invEntries = (await invRepo.find({
//           where: { bookId: it.bookId } as any,
//           order: { createdAt: "ASC" } as any
//         })) as Inventory[];

//         for (const entry of invEntries) {
//           if (remaining <= 0) break;
//           const available = Number(entry.quantity || 0);
//           if (available <= 0) continue;
//           const take = Math.min(available, remaining);
//           entry.quantity = available - take;
//           remaining -= take;
//           await invRepo.save(entry);
//         }
//         if (remaining > 0) {
//           throw new Error(`Not enough inventory for bookId ${it.bookId}`);
//         }
//       }

//       saleEntity.status = "APPROVED";
//       await salesRepo.save(saleEntity);

//       // marcar carrinho inativo
//       (cart as any).active = false;
//       await cartsRepo.save(cart);

//       return { saleId: saleEntity.id, status: saleEntity.status };
//     });
//   }
// }


import { getManager } from "typeorm";
import { SalesRepositories } from "../../repositories/SalesRepositories";
import { SaleItemsRepository } from "../../repositories/SaleItemsRepositories";
import { PaymentsRepository } from "../../repositories/PaymentsRepositories";
import { CouponsRepositories } from "../../repositories/CouponsRepositories";
import { InventoryRepository } from "../../repositories/InventoryRepositories";
import { CartItemsRepositories } from "../../repositories/CartItemsRepositories";
import { CartsRepositories } from "../../repositories/CartsRepositories";
import { CreditCardsRepositories } from "../../repositories/CreditCardsRepositories";
import { PaymentGatewayService } from "../Payment/PaymentGatewayService";

// Entities (para tipagem)
import { Sale } from "../../entities/Sale";
import { Coupon } from "../../entities/Coupon";
import { Inventory } from "../../entities/Inventory";
import { SaleItem } from "../../entities/SaleItem";
import { Payment } from "../../entities/Payment";

export class CreateSaleService {
  async execute(payload: {
    cartId: number;
    payments: any[];
    addressId?: number;
    clientId?: number;
  }) {
    const { cartId, payments, addressId, clientId } = payload;
    if (!cartId) throw new Error("cartId is required");

    return await getManager().transaction(async transactionalEntityManager => {
      const cartsRepo = transactionalEntityManager.getCustomRepository(CartsRepositories);
      const cartItemsRepo = transactionalEntityManager.getCustomRepository(CartItemsRepositories);
      const salesRepo = transactionalEntityManager.getCustomRepository(SalesRepositories);
      const saleItemsRepo = transactionalEntityManager.getCustomRepository(SaleItemsRepository);
      const paymentsRepo = transactionalEntityManager.getCustomRepository(PaymentsRepository);
      const couponsRepo = transactionalEntityManager.getCustomRepository(CouponsRepositories);
      const invRepo = transactionalEntityManager.getCustomRepository(InventoryRepository);
      const cardsRepo = transactionalEntityManager.getCustomRepository(CreditCardsRepositories);

      const cart = await cartsRepo.findOne({ where: { id: cartId }, relations: ["items"] });
      if (!cart) throw new Error("Cart not found");
      if (!cart.items || cart.items.length === 0) throw new Error("Cart has no items");

      // calcular total dos items usando preços do carrinho (precisa usar cart.items.price se existir)
      let itemsTotal = 0;
      for (const it of cart.items) {
        // preferir price no item do carrinho (preço final em momento de adição)
        const unitPrice = Number(it.price ?? 0);
        itemsTotal += +(unitPrice * Number(it.quantity)); // usar + para garantir number
      }
      // arredondar para 2 casas
      itemsTotal = Math.round((itemsTotal + Number.EPSILON) * 100) / 100;

      const freight = 0;
      let couponTotal = 0;

      // Criar entidade Sale — tipada explicitamente como Sale
      let saleEntity = salesRepo.create({
        status: "OPEN",
        freightValue: freight,
        clientId: clientId || (cart as any).clientId || null,
        deliveryAddressId: addressId || null,
        total: itemsTotal,
        appliedDiscount: couponTotal,
        couponUsedId: null
      } as Partial<Sale>) as Sale;

      saleEntity = await salesRepo.save(saleEntity); // aqui saleEntity é do tipo Sale (não array)

      // Criar itens da venda
      for (const it of cart.items) {
        const si = saleItemsRepo.create({
          sale: saleEntity,
          bookId: (it as any).bookId,
          quantity: it.quantity,
          unitPrice: (it as any).price || 0
        } as Partial<SaleItem>) as SaleItem;
        await saleItemsRepo.save(si);
      }

      // Preparar pagamentos (apenas registros de pagamento reais — ex: cartão)
      const createdPaymentEntities: Array<{ pay: Payment }> = [];

      // Lista de cupons aplicados (cupom = desconto, NÃO é forma de pagamento)
      const appliedCoupons: Coupon[] = [];

      for (const p of payments || []) {
        if (p.type === "CARD") {
          let cardEntity = null;
          if (p.newCard) {
            // Mantive os nomes de campos que você estava usando (cardNumber, cardHolderName, ...)
            cardEntity = cardsRepo.create({
              number: p.newCard.cardNumber,
              holderName: p.newCard.cardHolderName,
              brand: p.newCard.cardBrand,
              securityCode: p.newCard.cardCVV,
              expiry: p.newCard.cardExpirationDate,
              preferredCard: p.saveCard ? true : false,
              costumerId: clientId || (cart as any).clientId || null
            } as any);
            // Se quiser alteração: salvar somente quando saveCard === true.
            await cardsRepo.save(cardEntity);
          }

          const payEnt = paymentsRepo.create({
            sale: saleEntity,
            type: "CARD",
            value: Number(p.amount),
            cardId: cardEntity ? cardEntity.id : (p.cardId || null),
            status: "PENDING"
          } as Partial<Payment>) as Payment;
          await paymentsRepo.save(payEnt);
          createdPaymentEntities.push({ pay: payEnt });
        } else if (p.type === "COUPON") {
          // Agora cupom é tratado como desconto (não criamos Payment para cupom)
          if (!p.couponCode) throw new Error("couponCode is required for COUPON");

          // Buscar cupom e validar
          const coupon = (await couponsRepo.findOne({ where: { code: p.couponCode } })) as Coupon | null;
          if (!coupon) throw new Error(`Coupon ${p.couponCode} not found`);
          if (coupon.used) throw new Error(`Coupon ${p.couponCode} already used`);
          if (coupon.validity && new Date(coupon.validity) < new Date()) throw new Error(`Coupon ${p.couponCode} expired`);

          // Adiciona à lista de cupons aplicados (usar o valor do cupom para desconto)
          appliedCoupons.push(coupon);
          // NÃO criamos Payment para cupom — será aplicado como desconto no total
        } else {
          throw new Error(`Unsupported payment type: ${p.type}`);
        }
      }

      // --- Aplicar cupom(s) ao total da venda ANTES da captura de pagamentos ---
      // Somar valores dos cupons aplicados
      couponTotal = appliedCoupons.reduce((acc, c) => acc + Number(c.value || 0), 0);
      // arredondar couponTotal
      couponTotal = Math.round((couponTotal + Number.EPSILON) * 100) / 100;

      // Não permitir desconto maior que o total (cap)
      const maxDiscount = Math.round(((itemsTotal + freight) + Number.EPSILON) * 100) / 100;
      if (couponTotal > maxDiscount) couponTotal = maxDiscount;

      // Atualizar saleEntity com desconto aplicado e total final
      saleEntity.appliedDiscount = couponTotal;
      saleEntity.total = Math.round(((itemsTotal + freight - couponTotal) + Number.EPSILON) * 100) / 100;
      // salvar atualização da venda antes de validar pagamentos
      await salesRepo.save(saleEntity);

      // --- Validação: somatório dos pagamentos (APENAS pagamentos reais) deve bater com saleEntity.total ---
      const sumPayments = createdPaymentEntities.reduce((acc, c) => acc + Number(c.pay.value || 0), 0);
      const sumPaymentsRounded = Math.round((sumPayments + Number.EPSILON) * 100) / 100;
      if (sumPaymentsRounded !== saleEntity.total) {
        // Reverter marcando pagamentos PENDING -> REJECTED e cancelar venda
        for (const pEntity of createdPaymentEntities) {
          pEntity.pay.status = "REJECTED";
          await paymentsRepo.save(pEntity.pay);
        }
        saleEntity.status = "REJECTED";
        await salesRepo.save(saleEntity);
        throw new Error(`Sum of payments (${sumPaymentsRounded}) does not match sale total (${saleEntity.total}).`);
      }

      // Processar captura via gateway (apenas se houver valor a pagar)
      const cardPaymentsToProcess: Array<{ cardId?: string; amount: number }> = [];
      for (const cpe of createdPaymentEntities) {
        if (cpe.pay.type === "CARD") {
          cardPaymentsToProcess.push({
            cardId: cpe.pay.cardId ? String(cpe.pay.cardId) : undefined,
            amount: Number(cpe.pay.value)
          });
        }
      }

      const paymentGateway = new PaymentGatewayService();

      // Se não há valor a pagar (total === 0) pulamos a captura de cartão
      let gwRes: any = { approved: true, message: "No payment needed" };
      if (saleEntity.total > 0) {
        // Garantir que existem pagamentos de cartão se total > 0
        if (cardPaymentsToProcess.length === 0) {
          // não há forma de pagamento para o total
          for (const pEntity of createdPaymentEntities) {
            pEntity.pay.status = "REJECTED";
            await paymentsRepo.save(pEntity.pay);
          }
          saleEntity.status = "REJECTED";
          await salesRepo.save(saleEntity);
          throw new Error("No card payments provided to cover sale total.");
        }
        gwRes = await paymentGateway.captureAll(cardPaymentsToProcess);
      }

      if (!gwRes.approved) {
        // marcar pagamentos como REJECTED
        for (const pEntity of createdPaymentEntities) {
          pEntity.pay.status = "REJECTED";
          await paymentsRepo.save(pEntity.pay);
        }
        saleEntity.status = "REJECTED";
        await salesRepo.save(saleEntity);
        throw new Error("Payment not approved: " + gwRes.message);
      }

      // se aprovado -> APPROVED para pagamentos e marcar cupom(s) como usado corretamente
      for (const pEntity of createdPaymentEntities) {
        pEntity.pay.status = "APPROVED";
        await paymentsRepo.save(pEntity.pay);
      }

      // Marcar cupons usados (appliedCoupons) e salvar referência na venda (usar primeiro cupom quando houver campo único)
      if (appliedCoupons.length > 0) {
        for (const coup of appliedCoupons) {
          coup.used = true;
          coup.saleUsedId = saleEntity.id;
          await couponsRepo.save(coup);
        }
        // se sua entidade Sale suporta apenas um couponId, gravamos o primeiro
        saleEntity.couponUsedId = appliedCoupons[0].id;
        await salesRepo.save(saleEntity);
      }

      // Controle de estoque: buscar entradas de inventário pelo bookId e ordenar por createdAt (nome do campo deve bater com sua entity)
      const saleItems = await saleItemsRepo.find({ where: { sale: saleEntity } as any });
      for (const it of saleItems) {
        let remaining = Number((it as any).quantity);

        // ATENÇÃO: 'createdAt' deve existir na sua entity Inventory; se o nome for 'created_at' ajuste aqui.
        const invEntries = (await invRepo.find({
          where: { bookId: it.bookId } as any,
          order: { createdAt: "ASC" } as any
        })) as Inventory[];

        for (const entry of invEntries) {
          if (remaining <= 0) break;
          const available = Number(entry.quantity || 0);
          if (available <= 0) continue;
          const take = Math.min(available, remaining);
          entry.quantity = available - take;
          remaining -= take;
          await invRepo.save(entry);
        }
        if (remaining > 0) {
          throw new Error(`Not enough inventory for bookId ${it.bookId}`);
        }
      }

      saleEntity.status = "APPROVED";
      await salesRepo.save(saleEntity);

      // marcar carrinho inativo
      (cart as any).active = false;
      await cartsRepo.save(cart);

      return { saleId: saleEntity.id, status: saleEntity.status };
    });
  }
}
