import { Request, Response } from "express";
import { ListCouponService } from "../../service/Coupon/ListCouponService";

export class ListCouponController {
    async handle(request: Request, response: Response) {
        try {
            const service = new ListCouponService();
            const coupons = await service.execute();
            return response.json(coupons);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({ message: error.message });
            }
            return response.status(500).json({ message: "Erro interno dos servidor" });
        }
    }
}