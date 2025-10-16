// src/service/checkout/ListCheckoutByIDService.ts
import { getManager } from "typeorm";
import { SalesRepositories } from "../../repositories/SalesRepositories";
import { SaleItemsRepository } from "../../repositories/SaleItemsRepositories";
import { PaymentsRepository } from "../../repositories/PaymentsRepositories";
import { AddressesRepositories } from "../../repositories/AddressesRepositories";
import { BooksRepositories } from "../../repositories/BooksRepositories";
import { ShipmentsRepositories } from "../../repositories/ShipmentsRepositories";

/**
 * ListCheckoutByIDService
 * Retorna objeto enriquecido da venda identificada por saleId.
 */
export class ListSaleByIDService {
    async execute(saleId: number) {
        if (!saleId || Number.isNaN(saleId)) throw new Error("saleId inválido");

        const manager = getManager();
        const salesRepo = manager.getCustomRepository(SalesRepositories);
        const saleItemsRepo = manager.getCustomRepository(SaleItemsRepository);
        const paymentsRepo = manager.getCustomRepository(PaymentsRepository);
        const addressesRepo = manager.getCustomRepository(AddressesRepositories);
        const booksRepo = manager.getCustomRepository(BooksRepositories);
        const shipmentsRepo = manager.getCustomRepository(ShipmentsRepositories);

        // buscar venda
        const sale = await salesRepo.findOne({ where: { id: Number(saleId) } as any });
        if (!sale) return null;

        // buscar itens
        const saleItems = await saleItemsRepo.find({ where: { sale: sale } as any });

        // enriquecer itens com dados do livro
        const enrichedItems = [];
        for (const it of saleItems) {
            let book = null;
            try {
                book = await booksRepo.findOne({ where: { id: Number((it as any).bookId) } as any });
            } catch (e) {
                book = null;
            }

            enrichedItems.push({
                id: (it as any).id,
                bookId: (it as any).bookId,
                quantity: Number((it as any).quantity || 0),
                unitPrice: Number((it as any).unitPrice ?? (it as any).unit_price ?? 0),
                book: book
                    ? {
                        id: (book as any).id,
                        title: (book as any).title,
                        author: (book as any).author,
                        ISBN: (book as any).ISBN ?? (book as any).isbn ?? null,
                        price: Number((book as any).price ?? 0),
                        dimensions: (book as any).dimensions ?? null,
                        images: (book as any).images ?? null,
                    }
                    : null,
            });
        }

        // pagamentos
        const payments = await paymentsRepo.find({ where: { sale: sale } as any });

        // endereço de entrega
        let deliveryAddress = null;
        const addrId = (sale as any).deliveryAddressId || (sale as any).enderecoEntregaId || (sale as any).delivery_address_id;
        if (addrId) {
            deliveryAddress = await addressesRepo.findOne({ where: { id: Number(addrId) } as any });
        }

        // shipments vinculados (se existir)
        const shipments = await shipmentsRepo.find({ where: { saleId: Number(saleId) } as any });

        // montar objeto final
        const result = {
            id: (sale as any).id,
            status: (sale as any).status,
            clientId: (sale as any).clientId ?? (sale as any).clienteId ?? null,
            total: Number((sale as any).total ?? 0),
            appliedDiscount: Number((sale as any).appliedDiscount ?? (sale as any).descontoAplicado ?? 0),
            couponUsedId: (sale as any).couponUsedId ?? (sale as any).cupomUtilizadoId ?? null,
            freightValue: Number((sale as any).freightValue ?? (sale as any).valorFrete ?? 0),
            trackingCode: (sale as any).codigoRastreio ?? (sale as any).trackingCode ?? null,
            created_at: (sale as any).created_at ?? null,
            updated_at: (sale as any).updated_at ?? null,
            deliveryAddress,
            payments,
            items: enrichedItems,
            shipments,
        };

        return result;
    }
}
