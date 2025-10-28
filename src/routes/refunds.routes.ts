import { Router } from "express";
import { ProcessRefundController } from "../controller/refund/ProcessRefundController";
import { isAdmin } from "../Middleware/isAdmin";

const router = Router();

const processRefundController = new ProcessRefundController();

router.post('/:id/process', isAdmin, processRefundController.handle.bind(processRefundController));

export default router;