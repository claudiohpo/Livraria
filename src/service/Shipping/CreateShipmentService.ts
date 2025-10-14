// import { getManager } from "typeorm";
// import { ShipmentsRepositories } from "../../repositories/ShipmentsRepositories";
// import { Shipment } from "../../entities/Shipment";
// import { SalesRepositories } from "../../repositories/SalesRepositories";

// export class CreateShipmentService {
//     async execute(data: {
//         saleId: number;
//         freightValue: number;
//         trackingCode?: string | null;
//         carrier?: string | null;
//         serviceName?: string | null;
//     }) {
//         const manager = getManager();
//         const repo = manager.getCustomRepository(ShipmentsRepositories);
//         const salesRepo = manager.getCustomRepository(SalesRepositories);

//         const ent = repo.create({
//             saleId: data.saleId,
//             freightValue: data.freightValue,
//             trackingCode: data.trackingCode ?? null,
//             carrier: data.carrier ?? null,
//             serviceName: data.serviceName ?? null,
//         } as Shipment);

//         const shipment = await repo.save(ent);

//         // Atualiza a venda associada para gravar o valor do frete
//         const sale = await salesRepo.findOne({ where: { id: Number(data.saleId) } as any });
//         if (sale) {
//             (sale as any).freightValue = Number(data.freightValue || 0);
//             await salesRepo.save(sale);
//         }

//         return shipment;
//     }
// }


// import { getManager } from "typeorm";
// import { ShipmentsRepositories } from "../../repositories/ShipmentsRepositories";
// import { Shipment } from "../../entities/Shipment";
// import { SalesRepositories } from "../../repositories/SalesRepositories";

// export class CreateShipmentService {
//     async execute(data: {
//         saleId: number;
//         freightValue: number;
//         trackingCode?: string | null;
//         carrier?: string | null;
//         serviceName?: string | null;
//     }) {
//         const manager = getManager();
//         const repo = manager.getCustomRepository(ShipmentsRepositories);
//         const salesRepo = manager.getCustomRepository(SalesRepositories);

//         const ent = repo.create({
//             saleId: data.saleId,
//             freightValue: data.freightValue,
//             trackingCode: data.trackingCode ?? null,
//             carrier: data.carrier ?? null,
//             serviceName: data.serviceName ?? null,
//         } as Shipment);

//         const shipment = await repo.save(ent);

//         // Atualiza a venda associada para gravar o valor do frete
//         const sale = await salesRepo.findOne({ where: { id: Number(data.saleId) } as any });
//         if (sale) {
//             (sale as any).freightValue = Number(data.freightValue || 0);
//             await salesRepo.save(sale);
//         }

//         return shipment;
//     }
// }


import { getManager } from "typeorm";
import { ShipmentsRepositories } from "../../repositories/ShipmentsRepositories";
import { Shipment } from "../../entities/Shipment";
import { SalesRepositories } from "../../repositories/SalesRepositories";

export class CreateShipmentService {
    /**
     * Cria um Shipment e atualiza a Sale associada (freightValue e total) dentro de uma transação.
     * data: { saleId, freightValue, trackingCode?, carrier?, serviceName? }
     */
    async execute(data: {
        saleId: number;
        freightValue: number;
        trackingCode?: string | null;
        carrier?: string | null;
        serviceName?: string | null;
    }) {
        return await getManager().transaction(async (manager) => {
            const shipRepo = manager.getCustomRepository(ShipmentsRepositories);
            const salesRepo = manager.getCustomRepository(SalesRepositories);

            // cria o shipment
            const ent = shipRepo.create({
                saleId: Number(data.saleId),
                freightValue: Number(data.freightValue || 0),
                trackingCode: data.trackingCode ?? null,
                carrier: data.carrier ?? null,
                serviceName: data.serviceName ?? null,
            } as Shipment);

            const savedShipment = await shipRepo.save(ent);

            // atualiza a venda associada (freightValue e total)
            const sale = await salesRepo.findOne({ where: { id: Number(data.saleId) } as any });
            if (!sale) {
                // se não encontrar a sale, lança erro para reverter a transação
                throw new Error(`Sale (id=${data.saleId}) não encontrada`);
            }

            const prevFreight = Number((sale as any).freightValue || 0);
            const newFreight = Number(data.freightValue || 0);

            // Ajusta total: total = total - prevFreight + newFreight
            const prevTotal = Number((sale as any).total || 0);
            const adjustedTotal = Math.round(((prevTotal - prevFreight + newFreight) + Number.EPSILON) * 100) / 100;

            (sale as any).freightValue = newFreight;
            (sale as any).total = adjustedTotal;

            await salesRepo.save(sale);

            return savedShipment;
        });
    }
}
