import { Router } from "express";

import { CreateCostumerController } from "../controller/Costumer/CreateCostumerController";
import { ListCostumerController } from "../controller/Costumer/ListCostumerController";
import { DeleteCostumerController } from "../controller/Costumer/DeleteCostumerController";
import { UpdateCostumerController } from "../controller/Costumer/UpdateCostumerController";

const router = Router();

const createCostumerController = new CreateCostumerController();
const listCostumerController = new ListCostumerController();
const deleteCostumerController = new DeleteCostumerController();
const updateCostumerController = new UpdateCostumerController();

router.post("/", createCostumerController.handle.bind(createCostumerController));
router.get("/", listCostumerController.handle.bind(ListCostumerController));
router.delete("/:id", deleteCostumerController.handle.bind(deleteCostumerController));
router.put("/:id", updateCostumerController.handle.bind(updateCostumerController));

export default router;
