import { getManager } from 'typeorm';
import { SalesRepositories } from '../../repositories/SalesRepositories';
import { ReturnsRepositories } from '../../repositories/ReturnsRepositories';
import { RefundsRepositories } from '../../repositories/RefundsRepositories';
import { ReturnRequest } from '../../entities/ReturnRequest';
import { Refund } from '../../entities/Refund';
import { ReturnItem } from '../../entities/ReturnItem';

export class CreateReturnService {
    async execute(payload: {
        saleId: number;
        items: Array<{ vendaItemId: number; quantidade: number }>;
        motivo?: string;
        refundAllocation?: 'PROPORTIONAL' | 'ORDER';
        autoProcess?: boolean;
    }) {
        const { saleId, items, motivo, refundAllocation = 'ORDER', autoProcess = false } = payload;
        if (!saleId) throw new Error('saleId é obrigatório');
        if (!items || !Array.isArray(items) || items.length === 0) throw new Error('items obrigatórios');

        return await getManager().transaction(async tx => {
            const salesRepo = tx.getCustomRepository(SalesRepositories);
            const returnsRepo = tx.getCustomRepository(ReturnsRepositories);
            const refundsRepo = tx.getCustomRepository(RefundsRepositories);
            const returnItemRepo = tx.getRepository(ReturnItem);

            // Carrega venda com items e pagamentos
            const sale = await salesRepo.findOne(saleId, { relations: ['items', 'payments'] });
            if (!sale) throw new Error('Venda não encontrada');

            // Cria request de devolução 
            const rr = returnsRepo.create({
                saleId: sale.id,
                status: 'PENDING',
                reason: motivo || null,
                items: []
            } as Partial<ReturnRequest>);
            const savedReturn = await returnsRepo.save(rr);

            // Salva itens de devolução na tabela sale_return_items e calcula valor a reembolsar
            let refundAmount = 0;
            for (const it of items) {
                const si = (sale.items || []).find((x: any) => Number(x.id) === Number(it.vendaItemId));
                if (!si) throw new Error(`Item da venda não encontrado: ${it.vendaItemId}`);
                const qty = Number(it.quantidade);
                if (qty <= 0) throw new Error('Quantidade inválida');
                const saleItemQty = Number((si as any).quantity ?? (si as any).quantidade ?? (si as any).qty ?? 0);
                if (qty > saleItemQty) throw new Error('Quantidade solicitada maior que a vendida');

                // unitPrice detection
                const unitPrice = Number((si as any).precoUnitario ?? si.unitPrice ?? 0);

                const returnItem = returnItemRepo.create({
                    returnRequest: savedReturn,
                    saleItemId: si.id,
                    quantity: qty,
                    unitPrice
                });
                await returnItemRepo.save(returnItem);

                refundAmount += qty * unitPrice;
            }

            // Se não há valor a restituir, apenas retornamos o id do request
            if (refundAmount <= 0) {
                return { returnId: savedReturn.id, refundAmount: 0 };
            }

            // Cria reembolsos conforme alocação escolhida
            const payments = (sale.payments || []).map((p: any) => ({
                id: Number(p.id),
                type: (p.tipo || p.type || '').toUpperCase() || 'CARD',
                value: Number(p.valor ?? p.value ?? p.amount ?? 0)
            }));

            if (!payments || payments.length === 0) {
                const refundEntity = refundsRepo.create({
                    saleId: sale.id,
                    amount: refundAmount,
                    method: 'STORE_CREDIT',
                    status: 'PENDING',
                    paymentId: null
                } as Partial<Refund>);
                const savedRefund = await refundsRepo.save(refundEntity);

                if (autoProcess) {
                    const { ProcessRefundService } = await import('../../service/Refund/ProcessRefundService');
                    const prs = new ProcessRefundService();
                    await prs.execute({ refundId: savedRefund.id });
                }

                return { returnId: savedReturn.id, refundAmount, refundsCreated: [savedRefund.id] };
            }

            const createdRefundIds: number[] = [];

            if (refundAllocation === 'PROPORTIONAL') {
                const totalPaid = payments.reduce((s, p) => s + p.value, 0);
                for (const p of payments) {
                    const alloc = +(refundAmount * (p.value / totalPaid)).toFixed(2);
                    if (alloc <= 0) continue;
                    const refundEntity = refundsRepo.create({
                        saleId: sale.id,
                        amount: alloc,
                        method: p.type === 'COUPON' ? 'COUPON' : 'CARD',
                        status: 'PENDING',
                        paymentId: p.id
                    } as Partial<Refund>);
                    const savedRefund = await refundsRepo.save(refundEntity);
                    createdRefundIds.push(savedRefund.id);
                }
            } else {
                let remaining = refundAmount;
                for (const p of payments) {
                    if (remaining <= 0) break;
                    const take = Math.min(remaining, p.value);
                    if (take <= 0) continue;
                    const refundEntity = refundsRepo.create({
                        saleId: sale.id,
                        amount: take,
                        method: p.type === 'COUPON' ? 'COUPON' : 'CARD',
                        status: 'PENDING',
                        paymentId: p.id
                    } as Partial<Refund>);
                    const savedRefund = await refundsRepo.save(refundEntity);
                    createdRefundIds.push(savedRefund.id);
                    remaining = +(remaining - take);
                }
                if (remaining > 0.009) {
                    const refundEntity = refundsRepo.create({
                        saleId: sale.id,
                        amount: remaining,
                        method: 'STORE_CREDIT',
                        status: 'PENDING',
                        paymentId: null
                    } as Partial<Refund>);
                    const savedRefund = await refundsRepo.save(refundEntity);
                    createdRefundIds.push(savedRefund.id);
                }
            }

            if (autoProcess && createdRefundIds.length > 0) {
                const { ProcessRefundService } = await import('../../service/Refund/ProcessRefundService');
                const prs = new ProcessRefundService();
                for (const rId of createdRefundIds) {
                    await prs.execute({ refundId: rId });
                }
            }

            sale.status = 'RETURN_PENDING';
            await salesRepo.save(sale);

            return { returnId: savedReturn.id, refundAmount, refundsCreated: createdRefundIds };
        });
    }
}