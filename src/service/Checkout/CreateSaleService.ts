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
import { InventoryReservationsRepository } from "../../repositories/InventoryReservationsRepository";

import { Sale } from "../../entities/Sale";
import { Coupon } from "../../entities/Coupon";
import { Inventory } from "../../entities/Inventory";
import { SaleItem } from "../../entities/SaleItem";
import { Payment } from "../../entities/Payment";

type SelectedShipping = {
  serviceId?: string | number; // id ou código do serviço de frete selecionado
  freightValue: number;
  carrier?: string | null;
  serviceName?: string | null;
  raw?: any;
};

export class CreateSaleService {

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

      // --- INÍCIO: cálculo/decisão de frete ---
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
                // fallback: comparar por preço (com tolerância)
                const tol = 0.01;
                matched = services.find((s: any) => {
                  const p = Number(s.custom_price ?? s.price ?? s.price_total ?? 0);
                  return Math.abs(p - Number(selectedShipping.freightValue || 0)) <= tol;
                });
              }

              if (!matched) {
                // não encontrou correspondência confiável — opcionalmente rejeitar
                console.warn("Validação de selectedShipping falhou: serviço não encontrado no provider. Aceitando valor enviado pelo cliente.");
                // Verificar se deve rejeitar
                // throw new Error("Opção de frete selecionada não corresponde às opções do provedor");
              } else {
                // Se encontrou correspondência, validar preço
                const providerPrice = Number(matched.custom_price ?? matched.price ?? matched.price_total ?? 0);
                // Se houver divergência maior que tolerância, usar preço do provider
                const diff = Math.abs(providerPrice - Number(selectedShipping.freightValue || 0));
                if (diff > 0.01) {
                  console.warn(`SelectedShipping price (${selectedShipping.freightValue}) diverge do provider (${providerPrice}). Usando providerPrice.`);
                  freight = providerPrice;
                }
              }
            } catch (err: any) {
              console.error("Erro durante validação de selectedShipping:", err?.message || err);
            }
          }
        }
      } else if (addressId) {
        // Calcular frete via serviço
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

      // --- RN0035: Uso de cupons junto a cartão de crédito ---
      const hasCoupons = appliedCoupons.length > 0;
      const cardPayments = createdPaymentEntities.filter(c => c.pay.type === "CARD");

      // Se houver cupons + cartões
      if (hasCoupons && cardPayments.length > 0) {
        // Valor que sobra após aplicar cupons
        const residual = saleEntity.total;

        for (const cp of cardPayments) {
          const val = Number(cp.pay.value || 0);

          // Se o valor do cartão for menor que 10, só é permitido se for exatamente o residual
          if (val < 10 && val !== residual) {
            throw new Error(
              `Pagamento com cartão de valor menor que R$ 10,00 só é permitido para o valor residual da compra (${residual}).`
            );
          }
        }
      } else if (cardPayments.length > 0) {
        // Cenário sem cupons: aplica RN0034 (mínimo R$ 10,00 por cartão)
        for (const cp of cardPayments) {
          const val = Number(cp.pay.value || 0);
          if (val < 10) {
            throw new Error("Cada pagamento com cartão deve ser de no mínimo R$ 10,00.");
          }
        }
      }

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

      // Efetuando testee de controle de estoque --Versão original--
      // Controle de estoque
      // const saleItems = await saleItemsRepo.find({ where: { sale: saleEntity } as any });
      // for (const it of saleItems) {
      //   let remaining = Number((it as any).quantity);

      //   const invEntries = (await invRepo.find({
      //     where: { bookId: it.bookId } as any,
      //     order: { createdAt: "ASC" } as any
      //   })) as Inventory[];

      //   for (const entry of invEntries) {
      //     if (remaining <= 0) break;
      //     const available = Number(entry.quantity || 0);
      //     if (available <= 0) continue;
      //     const take = Math.min(available, remaining);
      //     entry.quantity = available - take;
      //     remaining -= take;
      //     await invRepo.save(entry);
      //   }
      //   if (remaining > 0) {
      //     throw new Error(`Não há estoque suficiente para o LivroID ${it.bookId}`);
      //   }
      // }

      // Controle de estoque (ajustado para considerar Reservations)
      const resRepo = transactionalEntityManager.getCustomRepository(InventoryReservationsRepository);

      // Usar os cart items para controle de estoque
      for (const cartIt of (cart as any).items) {
        const bookId = Number(cartIt.bookId);
        let needed = Number(cartIt.quantity || 0);

        if (!needed || needed <= 0) continue;

        // somar reservas existentes para este cartItem
        const reservations = await resRepo.find({ where: { cartItemId: Number(cartIt.id) } as any, order: { createdAt: "ASC" } as any });

        let reservedTotal = 0;
        for (const r of reservations) reservedTotal += Number(r.quantity || 0);

        // Se já reservado cobre tudo, apenas remover as reservations (não tocar Inventory)
        if (reservedTotal >= needed) {
          let toConsumeFromRes = needed;
          // consumir (deletar/ajustar) reservas até cobrir needed
          for (const r of reservations) {
            if (toConsumeFromRes <= 0) break;
            const use = Math.min(Number(r.quantity || 0), toConsumeFromRes);
            if (use <= 0) continue;

            if (use === Number(r.quantity || 0)) {
              // remove reservation completamente
              await resRepo.delete(r.id);
            } else {
              // reduzir quantidade da reservation
              r.quantity = Number(r.quantity) - use;
              await resRepo.save(r);
            }
            toConsumeFromRes -= use;
          }
          continue;
        }

        //Se faltou parte das unidades, consome as reservas e decremente inventário para o restante
        let remaining = needed;

        // consumir reservas parcialmente
        for (const r of reservations) {
          if (remaining <= 0) break;
          const use = Math.min(Number(r.quantity || 0), remaining);
          if (use <= 0) continue;

          if (use === Number(r.quantity || 0)) {
            await resRepo.delete(r.id);
          } else {
            r.quantity = Number(r.quantity) - use;
            await resRepo.save(r);
          }
          remaining -= use;
        }

        // agora remaining > 0 => precisamos decrementar do Inventory (FIFO)
        if (remaining > 0) {
          const invEntries = (await invRepo.find({
            where: { bookId: bookId } as any,
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
            // resta quantidade não atendida -> rollback via exception (transação irá reverter)
            throw new Error(`Não há estoque suficiente para o LivroID ${bookId}`);
          }
        }
      }
      // --- fim controle de estoque ---


      saleEntity.status = "APPROVED";
      await salesRepo.save(saleEntity);

      // marcar carrinho inativo
      (cart as any).active = false;
      await cartsRepo.save(cart);

      return { saleId: saleEntity.id, status: saleEntity.status };
    });
  }
}
