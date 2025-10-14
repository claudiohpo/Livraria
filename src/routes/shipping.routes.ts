import { Router } from "express";

import { QuoteShippingController } from "../controller/shipping/QuoteShippingController";
import { SelectShippingController } from "../controller/shipping/SelectShippingController";

const router = Router();

const quoteShippingController = new QuoteShippingController();
const selectShippingController = new SelectShippingController();

router.post("/quote", quoteShippingController.handle.bind(quoteShippingController));
router.post("/select", selectShippingController.handle.bind(selectShippingController));

export default router;