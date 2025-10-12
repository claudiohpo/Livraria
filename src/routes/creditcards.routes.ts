import { Router } from "express";
import { CreateCreditCardController } from "../controller/creditCard/CreateCreditCardController";
import { ListCreditCardController } from "../controller/creditCard/ListCreditCardController";

const router= Router();

const createCreditCardController = new CreateCreditCardController();
const listCreditCardController = new ListCreditCardController();

router.post("/", createCreditCardController.handle.bind(createCreditCardController));
router.get("/:costumerId", listCreditCardController.handle.bind(listCreditCardController));

export default router;