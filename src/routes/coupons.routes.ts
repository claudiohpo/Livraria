import { Router } from "express";

import { CreateCouponController } from "../controller/coupon/CreateCouponController";
import { ListCouponController } from "../controller/coupon/ListCouponController";
import { DeleteCouponController } from "../controller/coupon/DeleteCouponController";
import { UpdateCouponController } from "../controller/coupon/UpdateCouponController";

const router = Router();

const createCouponController = new CreateCouponController();
const listCouponController = new ListCouponController();
const deleteCouponController = new DeleteCouponController();
const updateCouponController = new UpdateCouponController();

router.post("/", createCouponController.handle.bind(createCouponController));
router.get("/", listCouponController.handle.bind(listCouponController));
router.delete("/:id", deleteCouponController.handle.bind(deleteCouponController));
router.put("/:id", updateCouponController.handle.bind(updateCouponController));

export default router;