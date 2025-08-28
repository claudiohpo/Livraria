import { Router } from "express";

import { CreateCostumerController } from "../controller/Costumer/CreateCostumerController";
import { ListCostumerController } from "../controller/Costumer/ListCostumerController";
import { DeleteCostumerController } from "../controller/Costumer/DeleteCostumerController";

const router = Router();

const createCostumerController = new CreateCostumerController();
const listCostumerController = new ListCostumerController();
const deleteCostumerController = new DeleteCostumerController();

router.post("/", createCostumerController.handle.bind(createCostumerController));
router.get("/", listCostumerController.handle.bind(ListCostumerController));
router.delete("/:id", deleteCostumerController.handle.bind(deleteCostumerController));

export default router;
