import { getCustomRepository } from "typeorm";
import { AddressesRepositories } from "../../repositories/AddressesRepositories";

export class DeleteAddressService {
    // exclui endereço por id
    async execute(id: number) {
        const addressRepo = getCustomRepository(AddressesRepositories);
        const address = await addressRepo.findOne(id);
        if (!address) throw new Error("Endereço não encontrado"); 
        await addressRepo.remove(address);
        return `Endereço id: ${id} removido com sucesso`;
    }
}