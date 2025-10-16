// import { getRepository } from "typeorm";
// import { Sale } from "../../entities/Sale";

// export class ListSaleService {
//     async execute(filter?: { id?: number; clientId?: number; status?: string }) {
//         const saleRepo = getRepository(Sale);
//         const where: any = {};
//         if (filter?.id) where.id = filter.id;
//         if (filter?.clientId) where.clientId = filter.clientId;
//         if (filter?.status) where.status = filter.status;
//         const sales = await saleRepo.find({ where, order: { created_at: "DESC" } });
//         return sales;
//     }
// }

// src/service/checkout/ListSaleService.ts
import { getManager } from "typeorm";
import { SalesRepositories } from "../../repositories/SalesRepositories";
import { SaleItemsRepository } from "../../repositories/SaleItemsRepositories";
import { PaymentsRepository } from "../../repositories/PaymentsRepositories";
import { AddressesRepositories } from "../../repositories/AddressesRepositories";
import { BooksRepositories } from "../../repositories/BooksRepositories";

/**
 * ListSaleService
 * - retorna vendas com enrich:
 *   - items: [{ id, bookId, quantity, unitPrice, book: { id, title, author, ISBN, dimensions, price } }]
 *   - freightValue (número)
 *   - payments (se existirem)
 *   - deliveryAddress (se existir)
 */
export class ListSaleService {
    async execute(filter: any = {}) {
        const manager = getManager();
        const salesRepo = manager.getCustomRepository(SalesRepositories);
        const saleItemsRepo = manager.getCustomRepository(SaleItemsRepository);
        const paymentsRepo = manager.getCustomRepository(PaymentsRepository);
        const addressesRepo = manager.getCustomRepository(AddressesRepositories);
        const booksRepo = manager.getCustomRepository(BooksRepositories);

        // Buscar vendas com o filtro (mantive flexível: filter pode ser {} ou { clientId: x } etc.)
        // Ajuste o order/where conforme seu padrão (aqui ordeno por created_at desc se existir)
        const sales = await salesRepo.find({
            where: filter as any,
            order: { created_at: "DESC" } as any,
        });

        const result: Array<any> = [];

        for (const sale of sales) {
            // buscar itens da venda
            const saleItems = await saleItemsRepo.find({
                where: { sale: sale } as any,
            });

            // Enriquecer cada item com dados do livro
            const enrichedItems = [];
            for (const it of saleItems) {
                // tentar pegar book completo
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
                            price: Number((book as any).price ?? (book as any).valorVenda ?? 0),
                            dimensions: (book as any).dimensions ?? {
                                height: (book as any).height ?? 0,
                                width: (book as any).width ?? 0,
                                depth: (book as any).depth ?? 0,
                                weight: (book as any).weight ?? 0,
                            },
                            images: (book as any).images ?? null,
                        }
                        : null,
                });
            }

            // pagamentos
            const payments = await paymentsRepo.find({ where: { sale: sale } as any });

            // endereço de entrega (se disponível)
            let deliveryAddress = null;
            const addrId = (sale as any).deliveryAddressId || (sale as any).enderecoEntregaId || (sale as any).delivery_address_id;
            if (addrId) {
                deliveryAddress = await addressesRepo.findOne({ where: { id: Number(addrId) } as any });
            }

            // montar objeto de resposta com tudo que importa
            result.push({
                id: (sale as any).id,
                status: (sale as any).status,
                clientId: (sale as any).clientId ?? (sale as any).clienteId ?? null,
                total: Number((sale as any).total ?? 0),
                appliedDiscount: Number((sale as any).appliedDiscount ?? (sale as any).descontoAplicado ?? 0),
                couponUsedId: (sale as any).couponUsedId ?? (sale as any).cupomUtilizadoId ?? null,
                freightValue: Number((sale as any).freightValue ?? (sale as any).valorFrete ?? 0),
                trackingCode: (sale as any).codigoRastreio ?? (sale as any).trackingCode ?? null,
                created_at: (sale as any).created_at ?? (sale as any).dataVenda ?? null,
                updated_at: (sale as any).updated_at ?? null,
                deliveryAddress,
                payments,
                items: enrichedItems,
            });
        }

        return result;
    }
}
