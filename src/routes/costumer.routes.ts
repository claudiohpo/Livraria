import { Router } from "express";

import { CreateCostumerController } from "../controller/Costumer/CreateCostumerController";
import { ListCostumerController } from "../controller/Costumer/ListCostumerController";
import { DeleteCostumerController } from "../controller/Costumer/DeleteCostumerController";
import { UpdateCostumerController } from "../controller/Costumer/UpdateCostumerController";
import { GetCostumerByEmailController } from "../controller/Costumer/GetCostumerByEmailController";

const router = Router();

const createCostumerController = new CreateCostumerController();
const listCostumerController = new ListCostumerController();
const deleteCostumerController = new DeleteCostumerController();
const updateCostumerController = new UpdateCostumerController();
const getCostumerByEmailController = new GetCostumerByEmailController();

router.post("/", createCostumerController.handle.bind(createCostumerController));
router.get("/", listCostumerController.handle.bind(listCostumerController)); // <--- corrigido "L" tava maiusculo na segunda parte
router.delete("/:id", deleteCostumerController.handle.bind(deleteCostumerController));
router.put("/:id", updateCostumerController.handle.bind(updateCostumerController));
router.get("/email/:email", getCostumerByEmailController.handle.bind(getCostumerByEmailController));

export default router;
