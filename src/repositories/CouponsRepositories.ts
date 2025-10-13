import { EntityRepository, Repository } from "typeorm";
import { Coupon } from "../entities/Coupon";

@EntityRepository(Coupon)
class CouponsRepositories extends Repository<Coupon> { }
export { CouponsRepositories };