// import { getManager } from 'typeorm';
// import { SalesRepositories } from '../../repositories/SalesRepositories';
// import { ExchangesRepositories } from '../../repositories/ExchangesRepositories';
// import { Exchange } from '../../entities/Exchange';


// export class CreateExchangeService {
//     async execute({ saleId, items, motivo }: { saleId: number; items: Array<{ vendaItemId: number; quantidade: number }>; motivo?: string }) {
//         if (!saleId) throw new Error('saleId é obrigatório');
//         if (!items || items.length === 0) throw new Error('items obrigatórios');


//         return await getManager().transaction(async tx => {
//             const salesRepo = tx.getCustomRepository(SalesRepositories);
//             const exchangesRepo = tx.getCustomRepository(ExchangesRepositories);


//             const sale = await salesRepo.findOne(saleId, { relations: ['items'] });
//             if (!sale) throw new Error('Venda não encontrada');


//             if ((sale.status || '').toUpperCase() !== 'ENTREGUE') {
//                 throw new Error('Somente vendas com status ENTREGUE podem solicitar troca');
//             }


//             const ex = exchangesRepo.create({ vendaId: sale.id, status: 'EM_TROCA', motivo: motivo || null, dataSolicitacao: new Date() } as Exchange);
//             const savedEx = await exchangesRepo.save(ex);


//             // Salvar itens de troca na tabela troca_itens
//             for (const it of items) {
//                 await tx.query(
//                     `INSERT INTO troca_itens (trocaId, vendaItemId, quantidade, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
//                     [savedEx.id, it.vendaItemId, it.quantidade, new Date(), new Date()]
//                 );
//             }


//             // Atualizar status da venda para EM_TROCA
//             sale.status = 'EM_TROCA';
//             await salesRepo.save(sale);


//             return { exchangeId: savedEx.id };
//         });
//     }
// }

import { getManager } from 'typeorm';
import { SalesRepositories } from '../../repositories/SalesRepositories';
import { ExchangesRepositories } from '../../repositories/ExchangesRepositories';
import { Exchange } from '../../entities/Exchange';
import { ExchangeItem } from '../../entities/ExchangeItem';

export class CreateExchangeService {
  async execute({ saleId, items, motivo }: { saleId: number; items: Array<{ vendaItemId: number; quantidade: number }>; motivo?: string }) {
    if (!saleId) throw new Error('saleId é obrigatório');
    if (!items || items.length === 0) throw new Error('items obrigatórios');

    return await getManager().transaction(async tx => {
      const salesRepo = tx.getCustomRepository(SalesRepositories);
      const exchangesRepo = tx.getCustomRepository(ExchangesRepositories);
      const exchangeItemRepo = tx.getRepository(ExchangeItem);

      const sale = await salesRepo.findOne(saleId, { relations: ['items'] });
      if (!sale) throw new Error('Venda não encontrada');

      if ((sale.status || '').toUpperCase() !== 'ENTREGUE' && (sale.status || '').toUpperCase() !== 'DELIVERED') {
        throw new Error('Somente vendas com status ENTREGUE podem solicitar troca');
      }

      const ex = exchangesRepo.create({
        vendaId: sale.id,
        status: 'EXCHANGE',
        motivo: motivo || null,
        dataSolicitacao: new Date()
      } as Exchange);
      const savedEx = await exchangesRepo.save(ex);

      // Salvar itens de troca via repo
      for (const it of items) {
        const exchangeItem = exchangeItemRepo.create({
          trocaId: savedEx.id,
          vendaItemId: it.vendaItemId,
          quantidade: it.quantidade
        });
        await exchangeItemRepo.save(exchangeItem);
      }

      // Atualizar status da venda para IN_EXCHANGE
      sale.status = 'EXCHANGE';
      await salesRepo.save(sale);

      return { exchangeId: savedEx.id };
    });
  }
}