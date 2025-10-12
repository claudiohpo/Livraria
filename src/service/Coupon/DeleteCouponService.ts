import { getCustomRepository } from "typeorm";
import { CouponsRepositories } from "../../repositories/CouponsRepositories";

export class DeleteCouponService {
    async execute(id: number): Promise<string> {
        const couponRepo = getCustomRepository(CouponsRepositories);

        const coupon = await couponRepo.findOne(id);

        if (!coupon) {
            throw new Error("Cupom não encontrado");
        }

        const couponId = coupon.id;
        const couponCode = coupon.code;

        await couponRepo.remove(coupon);

        return `Cupom ${couponCode} (id: ${couponId}) removido com sucesso`;
    }
}