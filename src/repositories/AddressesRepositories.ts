import { Repository, EntityRepository } from "typeorm";
import { Address } from "../entities/Address";

@EntityRepository(Address)
class AddressesRepositories extends Repository<Address> {
}

export { AddressesRepositories }