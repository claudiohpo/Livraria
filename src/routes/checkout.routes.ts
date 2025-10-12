import { Router, Request,Response } from "express";
import { CreateCheckoutController } from "../controller/checkout/CreateCheckoutController";
import { ListCheckoutController } from "../controller/checkout/ListCheckoutController";

const router = Router();

const createCheckoutController = new CreateCheckoutController();
const listCheckoutController = new ListCheckoutController();

router.post("/", createCheckoutController.handle.bind(createCheckoutController));
router.get("/", listCheckoutController.handle.bind(listCheckoutController));

export default router;