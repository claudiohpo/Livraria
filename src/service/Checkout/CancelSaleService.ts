import { getManager } from 'typeorm';
import { Sale } from '../../entities/Sale';
import { Refund } from '../../entities/Refund';
import { SalesRepositories } from '../../repositories/SalesRepositories';
import { RefundsRepositories } from '../../repositories/RefundsRepositories';
import { ProcessRefundService } from '../Refund/ProcessRefundService';


export class CancelSaleService {
    async execute({ saleId, reason }: { saleId: number; reason?: string }) {
        if (!saleId) throw new Error('saleId é obrigatório');


        return await getManager().transaction(async tx => {
            const salesRepo = tx.getCustomRepository(SalesRepositories);
            const refundsRepo = tx.getCustomRepository(RefundsRepositories);


            const sale = await salesRepo.findOne(saleId, { relations: ['items', 'payments'] });
            if (!sale) throw new Error('Venda não encontrada');


            const blockedStatuses = ['ENTREGUE', 'CANCELADA', 'TROCADA'];
            if (blockedStatuses.includes((sale.status || '').toUpperCase())) {
                throw new Error('Não é permitido cancelar venda no estado atual: ' + sale.status);
            }


            // Criar refund se houver pagamentos aprovados
            const approvedPayments = (sale.payments || []).filter((p: any) => (p.status || '').toUpperCase() === 'APPROVED');
            if (approvedPayments.length > 0) {
                const totalPaid = approvedPayments.reduce((s: number, p: any) => s + Number(p.valor || p.value || p.amount || 0), 0);
                const refund = refundsRepo.create({ saleId: sale.id, amount: totalPaid, method: 'CARD', status: 'PENDING', paymentId: approvedPayments[0].id });
                const savedRefund = await refundsRepo.save(refund);


                // processa estorno de forma síncrona (simulação conforme infra)
                const pr = new ProcessRefundService();
                await pr.execute({ refundId: savedRefund.id });
            }


            // Atualizar status da venda
            sale.status = 'CANCELADA';
            await salesRepo.save(sale);


            // Reestocar se os itens já haviam sido baixados do estoque
            // TODO: adaptar lógica de estoque — 
            // await InventoryService.restockSaleItems(sale.items);


            return { saleId: sale.id, status: sale.status };
        });
    }
}