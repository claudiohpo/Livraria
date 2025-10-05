//Define as rotas da API.
import { Router} from "express";
import priceGroupRoutes from "./routes/pricegroup.routes";
import categoryRoutes from "./routes/category.routes";
import bookRoutes from "./routes/book.routes";
import costumerRoutes from "./routes/costumer.routes";
import cartRoutes from "./routes/cart.routes";
import inventoryRoutes from "./routes/inventory.routes";



const router = Router();

router.use("/price-groups", priceGroupRoutes);
router.use("/costumers", costumerRoutes);
router.use("/category", categoryRoutes);
router.use("/book", bookRoutes);
router.use("/cart", cartRoutes);
router.use("/inventory", inventoryRoutes);

export {router};