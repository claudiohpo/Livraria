import { Request, Response } from "express";
import { UpdateCouponService } from "../../service/Coupon/UpdateCouponService";

export class UpdateCouponController {
    async handle(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const payload = request.body;

            const service = new UpdateCouponService();
            const servupdated = await service.execute({ id: Number(id), ...payload });
            return response.status(200).json(servupdated);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({ error: error.message });
            }
            return response.status(500).json({ error: "Internal server error" });
        }
    }
}