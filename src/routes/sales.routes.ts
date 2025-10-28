import { Router } from "express";
import { CancelSaleController } from "../controller/checkout/CancelSaleController";

const router = Router();

const cancelSaleController = new CancelSaleController();

router.post("/:id/cancel", cancelSaleController.handle.bind(cancelSaleController));

export default router;
