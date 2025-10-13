import { Router } from "express";

import { CreateCreditCardController } from "../controller/creditCard/CreateCreditCardController";
import { ListCreditCardController } from "../controller/creditCard/ListCreditCardController";
import { DeleteCreditCardController } from "../controller/creditCard/DeleteCreditCardController";
import { UpdateCreditCardController } from "../controller/creditCard/UpdateCreditCardController";

const router = Router();

const createCreditCardController = new CreateCreditCardController();
const listCreditCardController = new ListCreditCardController();
const deleteCreditCardController = new DeleteCreditCardController();
const updateCreditCardController = new UpdateCreditCardController();

router.post("/", createCreditCardController.handle.bind(createCreditCardController));
router.get("/id/:costumerId", listCreditCardController.byId.bind(listCreditCardController));
router.get("/email/:email", listCreditCardController.byEmail.bind(listCreditCardController));
router.delete("/:id", deleteCreditCardController.handle.bind(deleteCreditCardController));
router.put("/:id", updateCreditCardController.handle.bind(updateCreditCardController));

export default router;