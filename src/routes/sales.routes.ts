import { Router } from "express";
import { CancelSaleController } from "../controller/checkout/CancelSaleController";
import { UpdateSaleController } from "../controller/checkout/UpdateSaleController";

const router = Router();

const cancelSaleController = new CancelSaleController();
const updateSaleController = new UpdateSaleController();

router.post("/:id/cancel", cancelSaleController.handle.bind(cancelSaleController));
router.put("/:id", updateSaleController.handle.bind(updateSaleController));

export default router;
