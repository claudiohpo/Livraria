import { getManager } from "typeorm";
import { ShipmentQuotesRepositories } from "../../repositories/ShipmentQuotesRepositories";
import { ShipmentsRepositories } from "../../repositories/ShipmentsRepositories";
import { SalesRepositories } from "../../repositories/SalesRepositories";
import { ShippingService } from "./ShippingService"; // ajuste path se necessário

export class CreateShipmentFromQuoteService {
    // Envolve a chamada ao ShippingService.createShipmentFromQuote e faz persistência local via repos se necessário
    async execute(params: { saleId: number; quoteId: number; serviceId: string | number }) {
        // chamamos o integration service que faz a lógica externa + persistência(ja implementada em ShippingService)
        const shippingSvc = new ShippingService();
        const result = await shippingSvc.createShipmentFromQuote({
            saleId: params.saleId,
            quoteId: params.quoteId,
            serviceId: params.serviceId,
        });

        // O shippingSvc já cria o shipment e atualiza a sale na implementação que te dei.
        // Aqui apenas retornamos o resultado para o controller.
        return result;
    }
}
