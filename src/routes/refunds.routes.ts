import { Router } from "express";
import { ProcessRefundController } from "../controller/refund/ProcessRefundController";
import { isAdmin } from "../Middleware/isAdmin";
import { devAuth } from "../Middleware/devAuth";

const router = Router();

const processRefundController = new ProcessRefundController();

router.post('/:id/process', devAuth, isAdmin, processRefundController.handle.bind(processRefundController));

export default router;