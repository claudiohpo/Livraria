import { EntityRepository, Repository } from "typeorm";
import { Coupon } from "../entities/Coupon";

@EntityRepository(Coupon)
class CouponsRepository extends Repository<Coupon> {}
export { CouponsRepository };