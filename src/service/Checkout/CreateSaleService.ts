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
// import { AddressesRepositories } from "../../repositories/AddressesRepositories";
// import { BooksRepositories } from "../../repositories/BooksRepositories";
// import { ShippingService } from "../Shipping/ShippingService";

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
//     if (!cartId) throw new Error("cartId é obrigatório");

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
//       if (!cart) throw new Error("Carrinho não encontrado");
//       if (!cart.items || cart.items.length === 0) throw new Error("Carrinho vazio");

//       // calcular total dos items usando preços do carrinho 
//       let itemsTotal = 0;
//       for (const it of cart.items) {
//         // preferir price no item do carrinho (preço final em momento de adição)
//         const unitPrice = Number(it.price ?? 0);
//         itemsTotal += +(unitPrice * Number(it.quantity));
//       }
//       // arredondar para 2 casas
//       itemsTotal = Math.round((itemsTotal + Number.EPSILON) * 100) / 100;

//       // const freight = 0; //Antes sem o frete estava assim, adicionei o serviço de frete abaixo
//       // calcular frete real usando ShippingService e dimensões dos livros (Resumo abaixo)
//       /* Busca o endereço de entrega para obter o CEP
//       Busca os livros no carrinho para obter dimensões e peso
//       Chama ShippingService.calculateQuote() para obter a cotação
//       Usa o lowestPrice da cotação como valor do frete (ou 0 se não houver)
//       Se não houver endereço definido, frete fica 0 (regra do sistema)  */
      
//       const booksRepo = transactionalEntityManager.getCustomRepository(BooksRepositories);
//       const addressesRepo = transactionalEntityManager.getCustomRepository(AddressesRepositories);
//       const shippingService = new ShippingService();

//       let freight = 0;

//       if (addressId) {
//         // buscar endereço para obter zipcode
//         const deliveryAddress = await addressesRepo.findOne({ where: { id: Number(addressId) } });
//         if (!deliveryAddress) throw new Error("Endereço de entrega não encontrado");

//         const toPostal = (deliveryAddress as any).zipCode || (deliveryAddress as any).zip || (deliveryAddress as any).cep;
//         if (!toPostal) throw new Error("Endereço de entrega não possui CEP/zipCode");

//         // montar items para empacotamento (usa Book.dimensions e Book.price)
//         const cartItemsForPacking: Array<any> = [];
//         for (const it of cart.items) {
//           const bookId = Number((it as any).bookId);
//           const book = await booksRepo.findOne({ where: { id: bookId } });
//           if (!book) throw new Error(`Livro ${bookId} não encontrado para cálculo de frete`);

//           cartItemsForPacking.push({
//             bookId: book.id,
//             quantity: Number((it as any).quantity || 1),
//             dimensions: (book as any).dimensions || { height: 1, width: 1, depth: 1, weight: 0.1 },
//             price: Number((it as any).price ?? (book as any).price ?? 0),
//           });
//         }

//         // chamar o serviço de frete com tratamento de erro
//         try {
//           const quote = await shippingService.calculateQuote({
//             toPostalCode: String(toPostal),
//             cartItems: cartItemsForPacking,
//             fromPostalCode: process.env.MELHOR_ENVIO_ORIGIN_POSTAL_CODE || undefined,
//             //persist: false,
//           });

//           // escolher o menor preço disponível (se existir)
//           const services = Array.isArray(quote.services) ? quote.services : (quote.services?.result || quote.services?.services || []);
//           if (quote.lowestPrice && Number(quote.lowestPrice) > 0) {
//             freight = Number(quote.lowestPrice);
//           } else if (Array.isArray(services) && services.length > 0) {
//             const first = services[0];
//             freight = Number(first.custom_price ?? first.price ?? first.price_total ?? 0);
//           } else {
//             freight = 0;
//           }
//         } catch (err: any) {
//           // erro ao calcular frete: registrar e aplicar fallback
//           // NOTE: err.message já é string thanks ao ShippingService
//           console.error("Erro ao calcular frete:", err.message ?? err);
//           // fallback: não bloquear checkout — definir frete 0
//           freight = 0;

//           // se preferir abortar a venda quando falhar no cálculo do frete, descomente:
//           // throw new Error("Erro ao calcular frete: " + (err.message || err));
//         }
//       } else {
//         freight = 0;
//       }
//       // --- FIM: cálculo de frete ---

//       //Fim do frete


//       let couponTotal = 0;

//       // Criar entidade Sale
//       let saleEntity = salesRepo.create({
//         status: "OPEN",
//         freightValue: freight,
//         clientId: clientId || (cart as any).clientId || null,
//         deliveryAddressId: addressId || null,
//         total: itemsTotal,
//         appliedDiscount: couponTotal,
//         couponUsedId: null
//       } as Partial<Sale>) as Sale;

//       saleEntity = await salesRepo.save(saleEntity);

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
//       const createdPaymentEntities: Array<{ pay: Payment }> = [];

//       // Lista de cupons aplicados (cupom = desconto)
//       const appliedCoupons: Coupon[] = [];

//       for (const p of payments || []) {
//         if (p.type === "CARD") {
//           let cardEntity = null;
//           if (p.newCard) {
//             cardEntity = cardsRepo.create({
//               number: p.newCard.cardNumber,
//               holderName: p.newCard.cardHolderName,
//               brand: p.newCard.cardBrand,
//               securityCode: p.newCard.cardCVV,
//               expiry: p.newCard.cardExpirationDate,
//               preferredCard: p.saveCard ? true : false,
//               costumerId: clientId || (cart as any).clientId || null
//             } as any);
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
//           if (!p.couponCode) throw new Error("couponCode é obrigatório para pagamentos do tipo COUPON");

//           // Buscar cupom e validar
//           const coupon = (await couponsRepo.findOne({ where: { code: p.couponCode } })) as Coupon | null;
//           if (!coupon) throw new Error(`Cupom ${p.couponCode} não encontrado`);
//           if (coupon.used) throw new Error(`Cupom ${p.couponCode} já foi utilizado`);
//           if (coupon.validity && new Date(coupon.validity) < new Date()) throw new Error(`Cupom ${p.couponCode} venceu em ${coupon.validity}`);

//           // Adiciona à lista de cupons aplicados 
//           appliedCoupons.push(coupon);
//         } else {
//           throw new Error(`Forma de pagamento não suportada: ${p.type}`);
//         }
//       }

//       // Somar valores dos cupons aplicados
//       couponTotal = appliedCoupons.reduce((acc, c) => acc + Number(c.value || 0), 0);
//       // arredondar couponTotal
//       couponTotal = Math.round((couponTotal + Number.EPSILON) * 100) / 100;

//       // Não permitir desconto maior que o total
//       const maxDiscount = Math.round(((itemsTotal + freight) + Number.EPSILON) * 100) / 100;
//       if (couponTotal > maxDiscount) couponTotal = maxDiscount;

//       // Atualizar saleEntity com desconto aplicado e total final
//       saleEntity.appliedDiscount = couponTotal;
//       saleEntity.total = Math.round(((itemsTotal + freight - couponTotal) + Number.EPSILON) * 100) / 100;
//       // salvar atualização da venda antes de validar pagamentos
//       await salesRepo.save(saleEntity);

//       // Validação: somatório dos pagamentos - deve bater com saleEntity.total 
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
//         throw new Error(`A soma dos pagamentos (${sumPaymentsRounded}) não corresponde ao total da venda (${saleEntity.total}).`);
//       }

//       // Processar captura via gateway (apenas se houver valor a pagar)
//       const cardPaymentsToProcess: Array<{ cardId?: string; amount: number }> = [];
//       for (const cpe of createdPaymentEntities) {
//         if (cpe.pay.type === "CARD") {
//           cardPaymentsToProcess.push({
//             cardId: cpe.pay.cardId ? String(cpe.pay.cardId) : undefined,
//             amount: Number(cpe.pay.value)
//           });
//         }
//       }

//       const paymentGateway = new PaymentGatewayService();

//       // Se não há valor a pagar (total === 0) pula a captura de cartão
//       let gwRes: any = { approved: true, message: "Nenhum valor à pagar" };
//       if (saleEntity.total > 0) {
//         // Garantir que existem pagamentos de cartão se total > 0
//         if (cardPaymentsToProcess.length === 0) {
//           // não há forma de pagamento para o total
//           for (const pEntity of createdPaymentEntities) {
//             pEntity.pay.status = "REJECTED";
//             await paymentsRepo.save(pEntity.pay);
//           }
//           saleEntity.status = "REJECTED";
//           await salesRepo.save(saleEntity);
//           throw new Error("Nenhum pagamento com cartão foi fornecido para cobrir o total da venda.");
//         }
//         gwRes = await paymentGateway.captureAll(cardPaymentsToProcess);
//       }

//       if (!gwRes.approved) {
//         // marcar pagamentos como REJECTED
//         for (const pEntity of createdPaymentEntities) {
//           pEntity.pay.status = "REJECTED";
//           await paymentsRepo.save(pEntity.pay);
//         }
//         saleEntity.status = "REJECTED";
//         await salesRepo.save(saleEntity);
//         throw new Error("Pagamento não aprovado: " + gwRes.message);
//       }

//       // se aprovado -> APPROVED para pagamentos e marcar cupom(s) como usado corretamente
//       for (const pEntity of createdPaymentEntities) {
//         pEntity.pay.status = "APPROVED";
//         await paymentsRepo.save(pEntity.pay);
//       }

//       // Marcar cupons usados (appliedCoupons) e salvar referência na venda (usar primeiro cupom quando houver campo único)
//       if (appliedCoupons.length > 0) {
//         for (const coup of appliedCoupons) {
//           coup.used = true;
//           coup.saleUsedId = saleEntity.id;
//           await couponsRepo.save(coup);
//         }
//         saleEntity.couponUsedId = appliedCoupons[0].id;
//         await salesRepo.save(saleEntity);
//       }

//       // Controle de estoque: buscar entradas de inventário pelo bookId e ordenar por createdAt 
//       const saleItems = await saleItemsRepo.find({ where: { sale: saleEntity } as any });
//       for (const it of saleItems) {
//         let remaining = Number((it as any).quantity);

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
//           throw new Error(`Não há estoque suficiente para o LivroID ${it.bookId}`);
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
import { AddressesRepositories } from "../../repositories/AddressesRepositories";
import { BooksRepositories } from "../../repositories/BooksRepositories";
import { ShippingService } from "../Shipping/ShippingService";

import { Sale } from "../../entities/Sale";
import { Coupon } from "../../entities/Coupon";
import { Inventory } from "../../entities/Inventory";
import { SaleItem } from "../../entities/SaleItem";
import { Payment } from "../../entities/Payment";

type SelectedShipping = {
  serviceId?: string | number; // opcional (id do serviço retornado por /shipping/calculate)
  freightValue: number;
  carrier?: string | null;
  serviceName?: string | null;
  raw?: any; // opcional: a resposta crua para auditoria
};

export class CreateSaleService {
  /**
   * payload.selectedShipping?: quando enviado, será usado como valor do frete.
   * Se VALIDATE_SELECTED_SHIPPING=true, o servidor irá recalcular a cotação e comparar (mais seguro).
   */
  async execute(payload: {
    cartId: number;
    payments: any[];
    addressId?: number;
    clientId?: number;
    selectedShipping?: SelectedShipping;
  }) {
    const { cartId, payments, addressId, clientId, selectedShipping } = payload as any;
    if (!cartId) throw new Error("cartId é obrigatório");

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
      if (!cart) throw new Error("Carrinho não encontrado");
      if (!cart.items || cart.items.length === 0) throw new Error("Carrinho vazio");

      // calcular total dos items usando preços do carrinho 
      let itemsTotal = 0;
      for (const it of cart.items) {
        const unitPrice = Number(it.price ?? 0);
        itemsTotal += +(unitPrice * Number(it.quantity));
      }
      itemsTotal = Math.round((itemsTotal + Number.EPSILON) * 100) / 100;

      const booksRepo = transactionalEntityManager.getCustomRepository(BooksRepositories);
      const addressesRepo = transactionalEntityManager.getCustomRepository(AddressesRepositories);
      const shippingService = new ShippingService();

      // Prepara cartItemsForPacking (necessário tanto para cálculo quanto para validação)
      let cartItemsForPacking: Array<any> = [];
      if (addressId) {
        for (const it of cart.items) {
          const bookId = Number((it as any).bookId);
          const book = await booksRepo.findOne({ where: { id: bookId } });
          if (!book) throw new Error(`Livro ${bookId} não encontrado para cálculo de frete`);

          cartItemsForPacking.push({
            bookId: book.id,
            quantity: Number((it as any).quantity || 1),
            dimensions: (book as any).dimensions || { height: 1, width: 1, depth: 1, weight: 0.1 },
            price: Number((it as any).price ?? (book as any).price ?? 0),
          });
        }
      }

      // --- Decidir freightValue ---
      let freight = 0;

      if (selectedShipping && typeof selectedShipping.freightValue !== "undefined") {
        // Frontend enviou a opção escolhida
        freight = Number(selectedShipping.freightValue || 0);

        
        // Ative definindo VALIDATE_SELECTED_SHIPPING=true no .env
        if (process.env.VALIDATE_SELECTED_SHIPPING === "true") {
          if (!addressId) {
            // Não há endereço para validar contra o provider
            console.warn("VALIDATE_SELECTED_SHIPPING está ativo, mas addressId não foi fornecido. Pulando validação.");
          } else {
            try {
              const deliveryAddress = await addressesRepo.findOne({ where: { id: Number(addressId) } });
              if (!deliveryAddress) throw new Error("Endereço de entrega não encontrado para validação de frete");

              const toPostal = (deliveryAddress as any).zipCode || (deliveryAddress as any).zip || (deliveryAddress as any).cep;
              if (!toPostal) throw new Error("Endereço de entrega não possui CEP/zipCode para validação de frete");

              // chama provider para validar preços
              const remoteQuote = await shippingService.calculateQuote({
                toPostalCode: String(toPostal),
                cartItems: cartItemsForPacking,
                fromPostalCode: process.env.MELHOR_ENVIO_ORIGIN_POSTAL_CODE || undefined,
              });

              const services = Array.isArray(remoteQuote.services)
                ? remoteQuote.services
                : (remoteQuote.services?.result || remoteQuote.services?.services || []);

              // try to find service by id or by price
              let matched: any = null;
              if (selectedShipping.serviceId) {
                matched = (services || []).find((s: any) =>
                  String(s.id) === String(selectedShipping.serviceId) ||
                  String(s.service) === String(selectedShipping.serviceId)
                );
              }
              if (!matched && Array.isArray(services)) {
                // fallback: match by price (small tolerance)
                const tol = 0.01;
                matched = services.find((s: any) => {
                  const p = Number(s.custom_price ?? s.price ?? s.price_total ?? 0);
                  return Math.abs(p - Number(selectedShipping.freightValue || 0)) <= tol;
                });
              }

              if (!matched) {
                // não encontrou correspondência confiável — opcionalmente rejeitar
                console.warn("Validação de selectedShipping falhou: serviço não encontrado no provider. Aceitando valor enviado pelo cliente.");
                // Se preferir rejeitar, descomente:
                // throw new Error("Opção de frete selecionada não corresponde às opções do provedor");
              } else {
                // Se encontrou, assegure coerência — podemos sobrescrever freight com o valor do provider
                const providerPrice = Number(matched.custom_price ?? matched.price ?? matched.price_total ?? 0);
                // Se houver divergência significativa, substituímos o valor para evitar manipulação pelo client
                const diff = Math.abs(providerPrice - Number(selectedShipping.freightValue || 0));
                if (diff > 0.01) {
                  console.warn(`SelectedShipping price (${selectedShipping.freightValue}) diverge do provider (${providerPrice}). Usando providerPrice.`);
                  freight = providerPrice;
                }
              }
            } catch (err: any) {
              console.error("Erro durante validação de selectedShipping:", err?.message || err);
              // fallback: aceita o valor enviado pelo front (evita bloquear checkout por erro de validação)
            }
          }
        }
      } else if (addressId) {
        // comportamento original: calcular cotação automaticamente (ex.: menor preço)
        const deliveryAddress = await addressesRepo.findOne({ where: { id: Number(addressId) } });
        if (!deliveryAddress) throw new Error("Endereço de entrega não encontrado");

        const toPostal = (deliveryAddress as any).zipCode || (deliveryAddress as any).zip || (deliveryAddress as any).cep;
        if (!toPostal) throw new Error("Endereço de entrega não possui CEP/zipCode");

        try {
          const quote = await shippingService.calculateQuote({
            toPostalCode: String(toPostal),
            cartItems: cartItemsForPacking,
            fromPostalCode: process.env.MELHOR_ENVIO_ORIGIN_POSTAL_CODE || undefined,
          });

          const services = Array.isArray(quote.services) ? quote.services : (quote.services?.result || quote.services?.services || []);
          if (quote.lowestPrice && Number(quote.lowestPrice) > 0) {
            freight = Number(quote.lowestPrice);
          } else if (Array.isArray(services) && services.length > 0) {
            const first = services[0];
            freight = Number(first.custom_price ?? first.price ?? first.price_total ?? 0);
          } else {
            freight = 0;
          }
        } catch (err: any) {
          console.error("Erro ao calcular frete:", err.message ?? err);
          freight = 0;
        }
      } else {
        freight = 0;
      }
      // --- FIM: cálculo/decisão de frete ---

      let couponTotal = 0;

      // Criar entidade Sale
      let saleEntity = salesRepo.create({
        status: "OPEN",
        freightValue: freight,
        clientId: clientId || (cart as any).clientId || null,
        deliveryAddressId: addressId || null,
        total: itemsTotal,
        appliedDiscount: couponTotal,
        couponUsedId: null
      } as Partial<Sale>) as Sale;

      saleEntity = await salesRepo.save(saleEntity);

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

      // Preparar pagamentos 
      const createdPaymentEntities: Array<{ pay: Payment }> = [];

      // Lista de cupons aplicados (cupom = desconto)
      const appliedCoupons: Coupon[] = [];

      for (const p of payments || []) {
        if (p.type === "CARD") {
          let cardEntity = null;
          if (p.newCard) {
            cardEntity = cardsRepo.create({
              number: p.newCard.cardNumber,
              holderName: p.newCard.cardHolderName,
              brand: p.newCard.cardBrand,
              securityCode: p.newCard.cardCVV,
              expiry: p.newCard.cardExpirationDate,
              preferredCard: p.saveCard ? true : false,
              costumerId: clientId || (cart as any).clientId || null
            } as any);
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
          if (!p.couponCode) throw new Error("couponCode é obrigatório para pagamentos do tipo COUPON");

          // Buscar cupom e validar
          const coupon = (await couponsRepo.findOne({ where: { code: p.couponCode } })) as Coupon | null;
          if (!coupon) throw new Error(`Cupom ${p.couponCode} não encontrado`);
          if (coupon.used) throw new Error(`Cupom ${p.couponCode} já foi utilizado`);
          if (coupon.validity && new Date(coupon.validity) < new Date()) throw new Error(`Cupom ${p.couponCode} venceu em ${coupon.validity}`);

          // Adiciona à lista de cupons aplicados 
          appliedCoupons.push(coupon);
        } else {
          throw new Error(`Forma de pagamento não suportada: ${p.type}`);
        }
      }

      // Somar valores dos cupons aplicados
      couponTotal = appliedCoupons.reduce((acc, c) => acc + Number(c.value || 0), 0);
      couponTotal = Math.round((couponTotal + Number.EPSILON) * 100) / 100;

      const maxDiscount = Math.round(((itemsTotal + freight) + Number.EPSILON) * 100) / 100;
      if (couponTotal > maxDiscount) couponTotal = maxDiscount;

      // Atualizar saleEntity com desconto aplicado e total final
      saleEntity.appliedDiscount = couponTotal;
      saleEntity.total = Math.round(((itemsTotal + freight - couponTotal) + Number.EPSILON) * 100) / 100;
      await salesRepo.save(saleEntity);

      // Validação: somatório dos pagamentos - deve bater com saleEntity.total 
      const sumPayments = createdPaymentEntities.reduce((acc, c) => acc + Number(c.pay.value || 0), 0);
      const sumPaymentsRounded = Math.round((sumPayments + Number.EPSILON) * 100) / 100;
      if (sumPaymentsRounded !== saleEntity.total) {
        for (const pEntity of createdPaymentEntities) {
          pEntity.pay.status = "REJECTED";
          await paymentsRepo.save(pEntity.pay);
        }
        saleEntity.status = "REJECTED";
        await salesRepo.save(saleEntity);
        throw new Error(`A soma dos pagamentos (${sumPaymentsRounded}) não corresponde ao total da venda (${saleEntity.total}).`);
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

      let gwRes: any = { approved: true, message: "Nenhum valor à pagar" };
      if (saleEntity.total > 0) {
        if (cardPaymentsToProcess.length === 0) {
          for (const pEntity of createdPaymentEntities) {
            pEntity.pay.status = "REJECTED";
            await paymentsRepo.save(pEntity.pay);
          }
          saleEntity.status = "REJECTED";
          await salesRepo.save(saleEntity);
          throw new Error("Nenhum pagamento com cartão foi fornecido para cobrir o total da venda.");
        }
        gwRes = await paymentGateway.captureAll(cardPaymentsToProcess);
      }

      if (!gwRes.approved) {
        for (const pEntity of createdPaymentEntities) {
          pEntity.pay.status = "REJECTED";
          await paymentsRepo.save(pEntity.pay);
        }
        saleEntity.status = "REJECTED";
        await salesRepo.save(saleEntity);
        throw new Error("Pagamento não aprovado: " + gwRes.message);
      }

      for (const pEntity of createdPaymentEntities) {
        pEntity.pay.status = "APPROVED";
        await paymentsRepo.save(pEntity.pay);
      }

      if (appliedCoupons.length > 0) {
        for (const coup of appliedCoupons) {
          coup.used = true;
          coup.saleUsedId = saleEntity.id;
          await couponsRepo.save(coup);
        }
        saleEntity.couponUsedId = appliedCoupons[0].id;
        await salesRepo.save(saleEntity);
      }

      // Controle de estoque
      const saleItems = await saleItemsRepo.find({ where: { sale: saleEntity } as any });
      for (const it of saleItems) {
        let remaining = Number((it as any).quantity);

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
          throw new Error(`Não há estoque suficiente para o LivroID ${it.bookId}`);
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
