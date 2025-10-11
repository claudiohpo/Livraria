import { getCustomRepository, getRepository, getManager } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { SalesRepositories } from "../../repositories/SalesRepositories";
import { SaleItemsRepository } from "../../repositories/SaleItemsRepositories";
import { PaymentsRepository } from "../../repositories/PaymentsRepositories";
import { CouponsRepository } from "../../repositories/CouponsRepositories";
import { InventoryReservationsRepository } from "../../repositories/InventoryReservationsRepository";
import { InventoryRepository } from "../../repositories/InventoryRepositories";
import { CartItemsRepositories } from "../../repositories/CartItemsRepositories";
import { CartsRepositories } from "../../repositories/CartsRepositories";
import { CreditCardsRepositories } from "../../repositories/CreditCardsRepositories";
import { PaymentGatewayService } from "../Payment/PaymentGatewayService";
import { Sale } from "../../entities/Sale";

/**
 * Expected payload shape:
 * {
 *   cartId: string,
 *   addressId?: string, newAddress?: {...}, saveAddress?: boolean,
 *   payments: [
 *     { type: "CARD", cardId?: string, newCard?: {...}, saveCard?: boolean, amount: number },
 *     { type: "COUPON", couponCode: string, amount: number }
 *   ],
 *   clientId?: string
 * }
 *
 * Business rules implemented:
 * - Validate reservations cover cart items
 * - Validate coupon rules (1 promo)
 * - Sum payments equals remaining total (allow epsilon)
 * - Multi-card rule: each card >= 10 except if coupons cover most making card amount < 10 allowed (RN0034/RN0035)
 * - Create sale with status OPEN, payments PENDING
 * - Capture via PaymentGatewayService (mock)
 * - If approved: mark payments APPROVED, sale APPROVED, remove reservations (stock already decremented at reserve)
 * - If rejected: mark sale REJECTED, revert reservations (return stock) and mark payments accordingly
 */

export class CreateSaleService {
  async execute(payload: any) {
    const {
      cartId,
      addressId,
      newAddress,
      payments,
      clientId
    } = payload;

    if (!cartId) throw new Error("cartId is required");

    // transactionally execute sale
    return await getManager().transaction(async transactionalEntityManager => {
      const cartsRepo = transactionalEntityManager.getCustomRepository(CartsRepositories);
      const cartItemsRepo = transactionalEntityManager.getCustomRepository(CartItemsRepositories);
      const salesRepo = transactionalEntityManager.getCustomRepository(SalesRepositories);
      const saleItemsRepo = transactionalEntityManager.getCustomRepository(SaleItemsRepository);
      const paymentsRepo = transactionalEntityManager.getCustomRepository(PaymentsRepository);
      const couponsRepo = transactionalEntityManager.getCustomRepository(CouponsRepository);
      const invResRepo = transactionalEntityManager.getCustomRepository(InventoryReservationsRepository);
      const invRepo = transactionalEntityManager.getCustomRepository(InventoryRepository);
      const cardsRepo = transactionalEntityManager.getCustomRepository(CreditCardsRepositories);

      const cart = await cartsRepo.findOne(cartId);
      if (!cart) throw new Error("Cart not found");
      const cartItems = await cartItemsRepo.find({ where: { carrinhoId: cartId } });

      if (!cartItems || cartItems.length === 0) throw new Error("Cart is empty");

      // compute items total using cartItem price or book price
      let itemsTotal = 0;
      for (const it of cartItems) {
        const unitPrice = (it as any).priceUnitario || (it as any).precoUnitario || 0;
        itemsTotal += Number(unitPrice) * Number(it.quantidade);
      }

      const freight = 0; // placeholder - implement frete calc as RF0034
      let remainingTotal = itemsTotal + freight;

      // Validate reservations: each cartItem should be fully reserved
      for (const it of cartItems) {
        const reservations = await invResRepo.find({ where: { itemCarrinhoId: it.id }});
        const reservedQty = reservations.reduce((s, r) => s + Number(r.quantidade), 0);
        if (reservedQty < Number(it.quantidade)) {
          // attempt auto-adjust per RN0032: notify and update cart
          // For now throw error to force user to refresh cart
          throw new Error(`Stock changed for item ${it.livroId}. Reserved ${reservedQty} / requested ${it.quantidade}`);
        }
      }

      // Process coupon payments from payload
      const couponPayments = (payments || []).filter((p:any) => p.type === "COUPON");
      let couponTotal = 0;
      let promoCount = 0;
      const couponsUsed: any[] = [];
      for (const cp of couponPayments) {
        const coupon = await couponsRepo.findOne({ where: { codigo: cp.couponCode } as any });
        if (!coupon) throw new Error(`Coupon ${cp.couponCode} not found`);
        if (coupon.utilizado) throw new Error(`Coupon ${cp.couponCode} already used`);
        if ((coupon as any).tipo === "PROMOTIONAL") promoCount++;
        if (promoCount > 1) throw new Error("Only one promotional coupon allowed per purchase (RN0033)");
        couponsUsed.push(coupon);
        couponTotal += Number(cp.amount || coupon.valor || 0);
      }
      if (couponTotal > remainingTotal) couponTotal = remainingTotal; // cap
      remainingTotal = Number((remainingTotal - couponTotal).toFixed(2));
      if (remainingTotal < 0) remainingTotal = 0;

      // Validate card payments sum
      const cardPayments = (payments || []).filter((p:any) => p.type === "CARD");
      const sumCardAmounts = cardPayments.reduce((s:any, p:any) => s + Number(p.amount || 0), 0);
      if (Math.abs(sumCardAmounts - remainingTotal) > 0.01 && remainingTotal > 0) {
        throw new Error("Card payments do not sum to remaining total");
      }

      // RN0034/RN0035 validation
      const couponCovering = couponTotal > 0;
      for (const cp of cardPayments) {
        const amt = Number(cp.amount || 0);
        if (!couponCovering && amt > 0 && amt < 10) {
          throw new Error("Each card payment must be at least R$10,00 (RN0034)");
        }
      }

      // Create sale (status OPEN)
      const saleId = uuidv4();
      const sale = salesRepo.create({
        id: saleId,
        status: "OPEN",
        dataVenda: new Date(),
        clienteId: clientId || cart.clienteId || null,
        enderecoEntregaId: addressId || null,
        total: itemsTotal,
        descontoAplicado: couponTotal,
        valorFrete: freight
      } as any);
      await salesRepo.save(sale);

      // Create sale items
      for (const it of cartItems) {
        const item = saleItemsRepo.create({
          id: uuidv4(),
          vendaId: sale.id,
          livroId: it.livroId,
          quantidade: it.quantidade,
          precoUnitario: (it as any).priceUnitario || 0
        } as any);
        await saleItemsRepo.save(item);
      }

      // Create payment records (status PENDING)
      const createdPaymentEntities: any[] = [];
      for (const p of payments || []) {
        if (p.type === "CARD") {
          // if newCard provided, create card entity (and save if saveCard true)
          let cardEntity = null;
          if (p.cardId) {
            cardEntity = await cardsRepo.findOne(p.cardId);
            if (!cardEntity) throw new Error("Card not found");
          } else if (p.newCard) {
            cardEntity = cardsRepo.create({
              id: uuidv4(),
              numero: p.newCard.number,
              nomeTitular: p.newCard.name,
              bandeira: p.newCard.brand,
              codigoSeguranca: p.newCard.cvv,
              validade: p.newCard.expiration,
              preferencial: p.saveCard ? 1 : 0,
              clienteId: clientId || cart.clienteId || null
            } as any);
            await cardsRepo.save(cardEntity);
          }

          const pay = paymentsRepo.create({
            id: uuidv4(),
            vendaId: sale.id,
            tipo: "CARD",
            valor: Number(p.amount),
            cartaoId: cardEntity ? cardEntity.id : null,
            status: "PENDING"
          } as any);
          await paymentsRepo.save(pay);
          createdPaymentEntities.push({ pay, cardInfo: p.newCard ? { number: p.newCard.number } : { cardId: p.cardId } });
        } else if (p.type === "COUPON") {
          const pay = paymentsRepo.create({
            id: uuidv4(),
            vendaId: sale.id,
            tipo: "COUPON",
            valor: Number(p.amount),
            cupomId: p.couponCode,
            status: "PENDING"
          } as any);
          await paymentsRepo.save(pay);
          createdPaymentEntities.push({ pay, couponCode: p.couponCode });
        }
      }

      // Call payment gateway for card payments
      const gateway = new PaymentGatewayService();
      const cardsToCapture = createdPaymentEntities.filter(e => e.pay.tipo === "CARD").map(e => ({ ...e.cardInfo, amount: e.pay.valor }));
      const gwRes = await gateway.captureAll(cardsToCapture);
      if (!gwRes.approved) {
        // payment failed: revert reservations and mark sale REJECTED
        for (const r of await invResRepo.find({ where: { itemCarrinhoId: cartItems.map(ci=>ci.id) } as any })) {
          const inv = await invRepo.findOne(r.estoqueId || r.inventoryId);
          if (inv) {
            inv.quantity = Number(inv.quantity) + Number(r.quantidade);
            await invRepo.save(inv);
          }
          await invResRepo.remove(r);
        }
        sale.status = "REJECTED";
        await salesRepo.save(sale);
        // set payments REJECTED
        for (const pEntity of createdPaymentEntities) {
          pEntity.pay.status = "REJECTED";
          await paymentsRepo.save(pEntity.pay);
        }
        throw new Error("Payment not approved: " + gwRes.message);
      }

      // If approved -> mark payments APPROVED, mark sale APPROVED, remove reservations (stock already decremented)
      for (const pEntity of createdPaymentEntities) {
        pEntity.pay.status = "APPROVED";
        await paymentsRepo.save(pEntity.pay);
        if (pEntity.pay.tipo === "COUPON") {
          const coupon = await couponsRepo.findOne({ where: { codigo: pEntity.pay.cupomId } as any });
          if (coupon) {
            coupon.utilizado = 1;
            coupon.vendaUtilizadoId = sale.id;
            await couponsRepo.save(coupon);
          }
        }
      }

      // Remove reservations (they already reduced stock on reserve)
      const reservations = await invResRepo.find({ where: { itemCarrinhoId: cartItems.map(ci=>ci.id) } as any });
      for (const r of reservations) {
        await invResRepo.remove(r);
      }

      sale.status = "APPROVED";
      await salesRepo.save(sale);

      // Optionally set cart inactive
      cart.ativo = 0;
      await cartsRepo.save(cart);

      // Return sale id to caller
      return { saleId: sale.id, status: sale.status };
    });
  }
}
