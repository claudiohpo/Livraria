import { getRepository } from "typeorm";
import { Sale } from "../../entities/Sale";

export class ListSaleService {
    async execute(filter?: { id?: number; clientId?: number; status?: string }) {
        const saleRepo = getRepository(Sale);
        const where: any = {};
        if (filter?.id) where.id = filter.id;
        if (filter?.clientId) where.clientId = filter.clientId;
        if (filter?.status) where.status = filter.status;
        const sales = await saleRepo.find({ where, order: { created_at: "DESC" } });
        return sales;
    }
}