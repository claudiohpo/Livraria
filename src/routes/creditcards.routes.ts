import { Router } from "express";
import { CreateCreditCardController } from "../controller/creditCard/CreateCreditCardController";

const router= Router();

const createCreditCardController = new CreateCreditCardController();

router.post("/", createCreditCardController.handle.bind(createCreditCardController));

export default router;