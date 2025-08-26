import { Repository, EntityRepository } from "typeorm";
import { Costumer } from "../entities/Costumer";

@EntityRepository(Costumer)
class CostumersRepositories extends Repository<Costumer> {
}

export {CostumersRepositories}