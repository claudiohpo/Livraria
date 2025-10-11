import { Router } from "express";

import { CreateCartController } from "../controller/cart/CreateCartController";
import { GetCartController } from "../controller/cart/GetCartController";
import { UpdateCartController } from "../controller/cart/UpdateCartController";
import { DeleteCartController } from "../controller/cart/DeleteCartController";
import { ListCartController } from "../controller/cart/ListCartController";

import { AddCartItemController } from "../controller/cart/AddCartItemController";
import { UpdateCartItemController } from "../controller/cart/UpdateCartItemController"; 
import { RemoveCartItemController } from "../controller/cart/RemoveCartItemController";
import { ListCartItemController } from "../controller/cart/ListCartItemController";

const router = Router();

const createCartController = new CreateCartController();
const getCartController = new GetCartController();
const updateCartController = new UpdateCartController();
const deleteCartController = new DeleteCartController();
const listCartController = new ListCartController();

const addCartItemController = new AddCartItemController();
const updateCartItemController = new UpdateCartItemController();
const removeCartItemController = new RemoveCartItemController();
const listCartItemController = new ListCartItemController();


router.post("/", createCartController.handle.bind(createCartController));
router.get("/", listCartController.handle.bind(listCartController));
router.get("/:id", getCartController.handle.bind(getCartController));
router.put("/:id", updateCartController.handle.bind(updateCartController));
router.delete("/:id", deleteCartController.handle.bind(deleteCartController));

router.post("/:cartId/items", addCartItemController.handle.bind(addCartItemController));
router.put("/:cartId/items/:itemId", updateCartItemController.handle.bind(updateCartItemController));
router.delete("/:cartId/items/:itemId", removeCartItemController.handle.bind(removeCartItemController));
router.get("/:cartId/items", listCartItemController.handle.bind(listCartItemController));


export default router;