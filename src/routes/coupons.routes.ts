import { Router } from "express";
import { CreateCouponController } from "../controller/coupon/CreateCouponController";
import { ListCouponController } from "../controller/coupon/ListCouponController";

const router = Router();

const createCouponController = new CreateCouponController();
const listCouponController = new ListCouponController();

router.post("/", createCouponController.handle.bind(createCouponController));
router.get("/", listCouponController.handle.bind(listCouponController));


export default router;