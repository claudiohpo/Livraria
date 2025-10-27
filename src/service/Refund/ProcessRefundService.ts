import { getManager } from 'typeorm';
import { Refund } from '../../entities/Refund';
import { RefundsRepositories } from '../../repositories/RefundsRepositories';

export class ProcessRefundService {
    /**
     * Processa um refund registrado na tabela sale_refunds.
     * Observação: atualmente essa implementação faz uma simulação do processamento.
     */
    async execute({ refundId }: { refundId: number }) {
        if (!refundId) throw new Error('refundId é obrigatório');

        return await getManager().transaction(async tx => {
            const refundsRepo = tx.getCustomRepository(RefundsRepositories);
            const refund = await refundsRepo.findOne(refundId);
            if (!refund) throw new Error('Refund não encontrado');

            if ((refund.status || '').toUpperCase() !== 'PENDING') {
                throw new Error('Refund já processado ou em estado inválido');
            }

            try {
                // TODO: integrar com gateway  aqui
                // Exemplo:
                // if (refund.method === 'CARD') { await gateway.refund({ paymentId: refund.paymentId, amount: refund.amount }); }
                // if (refund.method === 'COUPON') { criar cupom ou creditar conta }

                // Simulação: marca como COMPLETED
                refund.status = 'COMPLETED';
                await refundsRepo.save(refund);

                return { ok: true, refundId: refund.id, status: refund.status };
            } catch (err: any) {
                refund.status = 'FAILED';
                await refundsRepo.save(refund);
                throw new Error('Falha ao processar refund: ' + String(err.message || err));
            }
        });
    }
}
