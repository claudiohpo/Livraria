import { Router } from "express";

import { AddCartItemController } from "../controller/cartitem/AddCartItemController";
import { UpdateCartItemController } from "../controller/cartitem/UpdateCartItemController";
import { RemoveCartItemController } from "../controller/cartitem/RemoveCartItemController";
import { ListCartItemController } from "../controller/cartitem/ListCartItemController";

const router = Router();

const addCartItemController = new AddCartItemController();
const updateCartItemController = new UpdateCartItemController();
const removeCartItemController = new RemoveCartItemController();
const listCartItemController = new ListCartItemController();

router.post("/:cartId/items", addCartItemController.handle.bind(addCartItemController));
router.put("/:cartId/items/:itemId", updateCartItemController.handle.bind(updateCartItemController));
router.delete("/:cartId/items/:itemId", removeCartItemController.handle.bind(removeCartItemController));
router.get("/:cartId/items", listCartItemController.handle.bind(listCartItemController));

export default router;