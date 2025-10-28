import { getManager } from "typeorm";
import { SalesRepositories } from "../../repositories/SalesRepositories";
import { Sale } from "../../entities/Sale";

export class UpdateSaleService {
    async execute(payload: {
        saleId: number;
        status?: string;
        addressId?: number;
        clientId?: number;
    }) {
        const { saleId, status, addressId, clientId } = payload;
        if (!saleId) throw new Error("saleId é obrigatório");

        return await getManager().transaction(async tx => {
            const salesRepo = tx.getCustomRepository(SalesRepositories);

            const sale = await salesRepo.findOne(saleId);
            if (!sale) throw new Error("Venda não encontrada");

            // Atualiza apenas os campos enviados
            if (status) sale.status = status;
            if (addressId) sale.deliveryAddressId = addressId;
            if (clientId) sale.clientId = clientId;

            const updatedSale = await salesRepo.save(sale);

            return {
                saleId: updatedSale.id,
                status: updatedSale.status,
                addressId: updatedSale.deliveryAddressId,
                clientId: updatedSale.clientId
            };
        });
    }
}