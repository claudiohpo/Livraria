import { getRepository } from "typeorm";
import { Coupon } from "../../entities/Coupon";

export class ListCouponService {
    async execute() {
        const couponRepo = getRepository(Coupon);
        const coupons = await couponRepo.find();
        return coupons;
    }
}