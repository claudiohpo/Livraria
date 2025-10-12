import { getCustomRepository } from "typeorm";
import { CouponsRepositories } from "../../repositories/CouponsRepositories";

export class UpdateCouponService {
  // atualiza um cupom
    async execute(data) {
    const { id, code, value, validity, type, minPurchaseValue, saleUsedId, used } = data;
    if (!id) throw new Error("ID do cupom é obrigatório");
    const couponRepo = getCustomRepository(CouponsRepositories);
    const coupon = await couponRepo.findOne(id);
    if (!coupon) throw new Error("Cupom não encontrado");   
    coupon.code = code ?? coupon.code;
    coupon.value = value ?? coupon.value;
    coupon.validity = validity ? new Date(validity) : coupon.validity;
    coupon.type = type ?? coupon.type;
    coupon.minPurchaseValue = minPurchaseValue ?? coupon.minPurchaseValue;
    coupon.saleUsedId = saleUsedId ?? coupon.saleUsedId;
    coupon.used = used ?? coupon.used;
    await couponRepo.save(coupon);
    return coupon;
  }
}