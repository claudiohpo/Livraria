import { getCustomRepository } from "typeorm";
import { AddressesRepositories } from "../../repositories/AddressesRepositories";
import { IAddressRequest } from "../../Interface/IAddressInterface";

export class UpdateAddressService {
  // atualiza um endereço
  async execute(data: IAddressRequest) {
    const { id, residenceType, streetType, street, number, complement, neighborhood, city, state, zipCode, observations } = data;
    if (!id) throw new Error("Address id is required");
    const addressRepo = getCustomRepository(AddressesRepositories);
    const address = await addressRepo.findOne(id);
    if (!address) throw new Error("Endereço não encontrado");

    address.residenceType = residenceType ?? address.residenceType;
    address.streetType = streetType ?? address.streetType;
    address.street = street ?? address.street;
    address.number = number ?? address.number;
    address.complement = complement ?? address.complement;
    address.neighborhood = neighborhood ?? address.neighborhood;
    address.city = city ?? address.city;
    address.state = state ?? address.state;
    address.zipCode = zipCode ?? address.zipCode;
    address.observations = observations ?? address.observations;
    await addressRepo.save(address);
    return address;
  } 
}
    