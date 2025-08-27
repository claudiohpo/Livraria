import { Router } from "express";

import { CreateCostumerController } from "../controller/Costumer/CreateCostumerController";

const router = Router();

const createCostumerController = new CreateCostumerController();

router.post("/", createCostumerController.handle.bind(createCostumerController));

export default router;
