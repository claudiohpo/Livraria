import { Router } from "express";
import { isAdmin } from "../Middleware/isAdmin";
import { devAuth } from "../Middleware/devAuth";

import { CreateExchangeController } from "../controller/checkout/CreateExchangeController";
import { AuthorizeExchangeController } from "../controller/admin/AuthorizeExchangeController";
import { resolve } from "url";

const router = Router();

const createExchangeController = new CreateExchangeController();
const authorizeExchangeController = new AuthorizeExchangeController();

router.post("/", createExchangeController.handle.bind(createExchangeController));
router.post('/:id/authorize', devAuth, isAdmin, authorizeExchangeController.handle.bind(authorizeExchangeController));

export default router;