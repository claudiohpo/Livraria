import { getCustomRepository } from "typeorm";
import { AddressesRepositories } from "../../repositories/AddressesRepositories";
import { IAddressRequest } from "../../Interface/IAddressInterface";
import { Costumer } from "../../entities/Costumer";

export class CreateAddressService {

    async execute(data: IAddressRequest, costumer: Costumer) {
        const addressesRepo = getCustomRepository(AddressesRepositories);

        const Address = addressesRepo.create({
            residenceType: data.residenceType,
            streetType: data.streetType,
            street: data.street,
            number: data.number,
            complement: data.complement,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            observations: data.observations ?? null,
            type: (data as any).type ?? undefined,
            // costumer: Array.isArray(costumer) ? costumer[0] : costumer
            costumer: costumer,
        });

        await addressesRepo.save(Address);
        return Address;
    }
}