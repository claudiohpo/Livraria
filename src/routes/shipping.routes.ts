import { Router } from "express";

import { CalculateShippingController } from "../controller/shipping/CalculateShippingController";

import { CreateShipmentController } from "../controller/shipping/CreateShipmentController";
import { ListShipmentsController } from "../controller/shipping/ListShipmentsController";
import { GetShipmentController } from "../controller/shipping/GetShipmentController";
import { UpdateShipmentController } from "../controller/shipping/UpdateShipmentController";
import { DeleteShipmentController } from "../controller/shipping/DeleteShipmentController";

const router = Router();

const calculateShippingController = new CalculateShippingController();

const createShipmentController = new CreateShipmentController();
const listShipmentsController = new ListShipmentsController();
const getShipmentController = new GetShipmentController();
const updateShipmentController = new UpdateShipmentController();
const deleteShipmentController = new DeleteShipmentController();


router.post("/calculate", calculateShippingController.handle.bind(calculateShippingController));

router.post("/", createShipmentController.handle.bind(createShipmentController));
router.get("/", listShipmentsController.handle.bind(listShipmentsController));
router.get("/:id", getShipmentController.handle.bind(getShipmentController));
router.put("/:id", updateShipmentController.handle.bind(updateShipmentController));
router.delete("/:id", deleteShipmentController.handle.bind(deleteShipmentController));

export default router;
