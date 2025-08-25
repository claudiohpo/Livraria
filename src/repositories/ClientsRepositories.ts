import { Repository, EntityRepository } from "typeorm";
import { Client } from "../entities/Client";

@EntityRepository(Client)
class ClientsRepositories extends Repository<Client> {
}

export {ClientsRepositories}