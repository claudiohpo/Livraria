import { Router } from "express";
import { CreateCouponController } from "../controller/coupon/createCouponController";

const router = Router();

const createCouponController = new CreateCouponController();

router.post("/", createCouponController.handle.bind(createCouponController));


export default router;