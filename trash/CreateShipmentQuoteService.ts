import { getManager } from "typeorm";
import { ShipmentQuotesRepositories } from "../../repositories/ShipmentQuotesRepositories";
import { ShipmentQuote } from "../../entities/ShipmentQuote";

export class CreateShipmentQuoteService {
    async execute(data: {
        cartId?: number;
        saleId?: number;
        fromPostalCode: string;
        toPostalCode: string;
        services: any;
        lowestPrice?: number;
    }) {
        const repo = getManager().getCustomRepository(ShipmentQuotesRepositories);
        const ent = repo.create({
            cartId: data.cartId ?? null,
            saleId: data.saleId ?? null,
            fromPostalCode: data.fromPostalCode,
            toPostalCode: data.toPostalCode,
            services: data.services,
            lowestPrice: data.lowestPrice ?? null,
        } as ShipmentQuote);
        return await repo.save(ent);
    }
}
