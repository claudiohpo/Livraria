import { EntityRepository, Repository } from "typeorm";
import { PriceGroup } from "../entities/PriceGroup";

@EntityRepository(PriceGroup)
class PriceGroupRepository extends Repository<PriceGroup> {}

export { PriceGroupRepository };
