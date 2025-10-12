import { getCustomRepository } from "typeorm";
import { CouponsRepositories } from "../../repositories/CouponsRepositories";
import { ICouponRequest } from "../../Interface/ICouponInterface";

export class CreateCouponService {
    async execute(data: ICouponRequest) {
        const couponsRepo = getCustomRepository(CouponsRepositories);

        const coupon = couponsRepo.create({
            code: data.code,
            value: data.value,
            validity: data.validity || null,
            used: data.used || false,
            saleUsedId: data.saleUsedId || null,
            type: data.type || null,
            minPurchaseValue: data.minPurchaseValue || null
        } as any);
        await couponsRepo.save(coupon);
        return coupon;
    }
}