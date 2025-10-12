//Define as rotas da API.
import { Router} from "express";
import priceGroupRoutes from "./routes/pricegroup.routes";
import categoryRoutes from "./routes/category.routes";
import bookRoutes from "./routes/book.routes";
import costumerRoutes from "./routes/costumer.routes";
import cartRoutes from "./routes/cart.routes";
import inventoryRoutes from "./routes/inventory.routes";
import bookImageRoutes from "./routes/bookimage.routes";
import cartItemRoutes from "./routes/cartitems.routes";
import checkoutRoutes from "./routes/checkout.routes";
import addressRoutes from "./routes/address.routes";
import creditcardRoutes from "./routes/creditcards.routes";
import coupon from "./routes/coupons.routes";


const router = Router();


router.use("/price-groups", priceGroupRoutes);
router.use("/costumers", costumerRoutes);
router.use("/category", categoryRoutes);
router.use("/book", bookRoutes);
router.use("/cart", cartRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/bookImages", bookImageRoutes);
router.use("/cart", cartItemRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/address", addressRoutes);
router.use("/creditcards", creditcardRoutes);
router.use("/coupons", coupon);

export {router};