import { Router } from "express";

import { CreateInventoryController } from "../controller/inventory/CreateInventoryController";
import { ListInventoryController } from "../controller/inventory/ListInventororyController";
import { CleanupReservationsController } from "../controller/inventory/CleanupReservationsController";

const router = Router();

const createInventoryController = new CreateInventoryController();
const listInventoryController = new ListInventoryController();
const cleanupReservationsController = new CleanupReservationsController();

router.post("/", createInventoryController.handle.bind(createInventoryController));
router.get("/", listInventoryController.handle.bind(listInventoryController));
router.post("/cleanup", cleanupReservationsController.handle.bind(cleanupReservationsController));
export default router;