import { Router } from "express";

import { QuoteShippingController } from "../controller/shipping/QuoteShippingController";

import { CreateShipmentQuoteController } from "../controller/shipping/CreateShipmentQuoteController";
import { ListShipmentQuotesController } from "../controller/shipping/ListShipmentQuotesController";
import { GetShipmentQuoteController } from "../controller/shipping/GetShipmentQuoteController";
import { UpdateShipmentQuoteController } from "../controller/shipping/UpdateShipmentQuoteController";
import { DeleteShipmentQuoteController } from "../controller/shipping/DeleteShipmentQuoteController";

import { CreateShipmentController } from "../controller/shipping/CreateShipmentController";
import { ListShipmentsController } from "../controller/shipping/ListShipmentsController";
import { GetShipmentController } from "../controller/shipping/GetShipmentController";
import { UpdateShipmentController } from "../controller/shipping/UpdateShipmentController";
import { DeleteShipmentController } from "../controller/shipping/DeleteShipmentController";

import { CreateShipmentFromQuoteController } from "../controller/shipping/CreateShipmentFromQuoteController";

import { SelectShippingController } from "../controller/shipping/SelectShippingController"; //Que isso?

const router = Router();

const quoteShippingController = new QuoteShippingController();

const createShipmentQuoteController = new CreateShipmentQuoteController();
const listShipmentQuotesController = new ListShipmentQuotesController();
const getShipmentQuoteController = new GetShipmentQuoteController();
const updateShipmentQuoteController = new UpdateShipmentQuoteController();
const deleteShipmentQuoteController = new DeleteShipmentQuoteController();

const createShipmentController = new CreateShipmentController();
const listShipmentsController = new ListShipmentsController();
const getShipmentController = new GetShipmentController();
const updateShipmentController = new UpdateShipmentController();
const deleteShipmentController = new DeleteShipmentController();

const createShipmentFromQuoteController = new CreateShipmentFromQuoteController();

const selectShippingController = new SelectShippingController();//QUe isso?

router.post("/quote", quoteShippingController.handle.bind(quoteShippingController));

router.post("/quotes", createShipmentQuoteController.handle.bind(createShipmentQuoteController));
router.get("/quotes", listShipmentQuotesController.handle.bind(listShipmentQuotesController));
router.get("/quotes/:id", getShipmentQuoteController.handle.bind(getShipmentQuoteController));
router.put("/quotes/:id", updateShipmentQuoteController.handle.bind(updateShipmentQuoteController));
router.delete("/quotes/:id", deleteShipmentQuoteController.handle.bind(deleteShipmentQuoteController));

router.post("/", createShipmentController.handle.bind(createShipmentController));
router.get("/", listShipmentsController.handle.bind(listShipmentsController));
router.get("/:id", getShipmentController.handle.bind(getShipmentController));
router.put("/:id", updateShipmentController.handle.bind(updateShipmentController));
router.delete("/:id", deleteShipmentController.handle.bind(deleteShipmentController));

router.post("/from-quote", createShipmentFromQuoteController.handle.bind(createShipmentFromQuoteController));

router.post("/select", selectShippingController.handle.bind(selectShippingController));// Que isso?

export default router;