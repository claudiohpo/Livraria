import { Router } from "express";

import { CreateCheckoutController } from "../controller/checkout/CreateCheckoutController";
import { ListCheckoutController } from "../controller/checkout/ListCheckoutController";
import { ListSaleByIDController } from "../controller/checkout/ListSaleByIDController";

const router = Router();

const createCheckoutController = new CreateCheckoutController();
const listCheckoutController = new ListCheckoutController();
const listSaleByController = new ListSaleByIDController();

router.post("/", createCheckoutController.handle.bind(createCheckoutController));
router.get("/", listCheckoutController.handle.bind(listCheckoutController));
router.get("/:id", listSaleByController.handle.bind(listSaleByController));

export default router;