import { Router } from "express";

import { CreateCartController } from "../controller/cart/CreateCartController";
import { GetCartController } from "../controller/cart/GetCartController";
import { UpdateCartController } from "../controller/cart/UpdateCartController";
import { DeleteCartController } from "../controller/cart/DeleteCartController";
import { ListCartController } from "../controller/cart/ListCartController";

const router = Router();

const createCartController = new CreateCartController();
const getCartController = new GetCartController();
const updateCartController = new UpdateCartController();
const deleteCartController = new DeleteCartController();
const listCartController = new ListCartController();

router.post("/", createCartController.handle.bind(createCartController));
router.get("/", listCartController.handle.bind(listCartController));
router.get("/:id", getCartController.handle.bind(getCartController));
router.put("/:id", updateCartController.handle.bind(updateCartController));
router.delete("/:id", deleteCartController.handle.bind(deleteCartController));




export default router;