import { Router } from "express";
import { isAdmin } from "../Middleware/isAdmin";
import { devAuth } from "../Middleware/devAuth";

import { CreateExchangeController } from "../controller/checkout/CreateExchangeController";
import { AuthorizeExchangeController } from "../controller/admin/AuthorizeExchangeController";
import { ListExchangesController } from "../controller/checkout/ListExchangesController";
import { ExchangeController } from "../controller/exchange/ExchangeController";

const router = Router();

const createExchangeController = new CreateExchangeController();
const authorizeExchangeController = new AuthorizeExchangeController();
const listExchangesController = new ListExchangesController();
const exchangeController = new ExchangeController();

router.get("/", listExchangesController.handle.bind(listExchangesController));
router.post("/", createExchangeController.handle.bind(createExchangeController));
router.post('/:id/authorize', devAuth, isAdmin, authorizeExchangeController.handle.bind(authorizeExchangeController));
router.put('/:id', exchangeController.confirmReceive.bind(exchangeController));

export default router;