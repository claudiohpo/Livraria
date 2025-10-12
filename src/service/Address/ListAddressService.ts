import { getRepository } from "typeorm";
import { Address } from "../../entities/Address";

export class ListAddressService {
    async execute(costumerId: string) {
        const addressRepo = getRepository(Address);
        const addresses = await addressRepo.find({
            where: { costumer: { id: costumerId } }
            // relations: ["costumer"]
        });
        return addresses;
    }
}