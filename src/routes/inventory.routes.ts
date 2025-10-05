import { Router } from "express";

import { CreateInventoryController } from "../controller/inventory/CreateInventoryController";
import { ListInventoryController } from "../controller/inventory/ListInventororyController";

const router = Router();

const createInventoryController = new CreateInventoryController();
const listInventoryController = new ListInventoryController();

router.post("/", createInventoryController.handle.bind(createInventoryController)); // "/"ou "/inventory"???
router.get("/", listInventoryController.handle.bind(listInventoryController));

export default router;