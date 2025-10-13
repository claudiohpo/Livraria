import { Router } from "express";

import { CreatePriceGroupController } from "../controller/pricegroup/CreatePriceGroupController";
import { ListPriceGroupController } from "../controller/pricegroup/ListPriceGroupController";
import { UpdatePriceGroupController } from "../controller/pricegroup/UpdatePriceGroupController";
import { DeletePriceGroupController } from "../controller/pricegroup/DeletePriceGroupController";

const router = Router();

const createPriceGroupController = new CreatePriceGroupController();
const listPriceGroupController = new ListPriceGroupController();
const updatePriceGroupController = new UpdatePriceGroupController();
const deletePriceGroupController = new DeletePriceGroupController();

router.post("/", createPriceGroupController.handle.bind(createPriceGroupController));
router.get("/", listPriceGroupController.handle.bind(listPriceGroupController));
router.put("/:id", updatePriceGroupController.handle.bind(updatePriceGroupController));
router.delete("/:id", deletePriceGroupController.handle.bind(deletePriceGroupController));

export default router;