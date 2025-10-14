import { getManager } from "typeorm";
import { ShipmentsRepositories } from "../../repositories/ShipmentsRepositories";
import { Shipment } from "../../entities/Shipment";

export class CreateShipmentService {
    async execute(data: {
        saleId: number;
        freightValue: number;
        trackingCode?: string | null;
        carrier?: string;
        serviceName?: string;
    }) {
        const repo = getManager().getCustomRepository(ShipmentsRepositories);
        const ent = repo.create({
            saleId: data.saleId,
            freightValue: data.freightValue,
            trackingCode: data.trackingCode ?? null,
            carrier: data.carrier ?? null,
            serviceName: data.serviceName ?? null,
        } as Shipment);
        return await repo.save(ent);
    }
}
