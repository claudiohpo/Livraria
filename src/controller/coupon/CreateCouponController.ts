import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { CouponsRepositories } from "../../repositories/CouponsRepositories";
import { Coupon } from "../../entities/Coupon";

export class CreateCouponController {
  async handle(request: Request, response: Response) {
    try {
      const data = request.body as Partial<Coupon>;
      const couponsRepo = getCustomRepository(CouponsRepositories);

      const coupon = couponsRepo.create({
        code: data.code,
        value: data.value,
        type: data.type || "PROMO",
        validity: data.validity ? new Date(data.validity) : null,
        minPurchaseValue: data.minPurchaseValue ?? 0,
      });

      await couponsRepo.save(coupon);
      return response.status(201).json(coupon);
    } catch (error) {
      if (error instanceof Error) return response.status(400).json({ error: error.message });
      return response.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
