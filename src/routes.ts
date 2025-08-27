//Define as rotas da API.
import { Router} from "express";
import priceGroupRoutes from "./routes/pricegroup.routes";
import categoryRoutes from "./routes/category.routes";
import bookRoutes from "./routes/book.routes";
import costumerRoutes from "./routes/costumer.routes";


const router = Router();

router.use("/price-groups", priceGroupRoutes);
router.use("/costumers", costumerRoutes);
router.use("/category", categoryRoutes);
router.use("/book", bookRoutes);

export {router};


//Novo - LIVRARIA
//Book
// import { CreateBookController } from "./controller/book/CreateBookController"; 

// //Category
// import { CreateCategoryController } from "./controller/category/CreateCategoryController";
// import { ListCategoryController } from "./controller/category/ListCategoryController";
// import { UpdateCategoryController } from "./controller/category/UpdateCategoryController";
// import { DeleteCategoryController } from "./controller/category/DeleteCategoryController";

// //PriceGroup
// import { CreatePriceGroupController } from "./controller/pricegroup/CreatePriceGroupController";
// import { ListPriceGroupController } from "./controller/pricegroup/ListPriceGroupController";
// import { UpdatePriceGroupController } from "./controller/pricegroup/UpdatePriceGroupController";
// import { DeletePriceGroupController } from "./controller/pricegroup/DeletePriceGroupController";




//Novo - LIVRARIA
//Book
// const createBookController = new CreateBookController();
// const listBooksController = new ListBooksController();
// const updateBooksController = new UpdateBooksController();
// const deleteBooksController = new DeleteBooksController();

// //Category
// const createCategoryController = new CreateCategoryController();
// const listCategoryController = new ListCategoryController();
// const updateCategoryController = new UpdateCategoryController();
// const deleteCategoryController = new DeleteCategoryController();

// //PriceGroup
// const createPriceGroupController = new CreatePriceGroupController();
// const listPriceGroupController = new ListPriceGroupController();
// const updatePriceGroupController = new UpdatePriceGroupController();
// const deletePriceGroupController = new DeletePriceGroupController();

//Novo - LIVRARIA
//Book
// router.post("/book", createBookController.handle.bind(createBookController));

// //Category
// router.post("/category", createCategoryController.handle.bind(createCategoryController));
// router.get("/category", listCategoryController.handle.bind(listCategoryController));
// router.put("/category/:id", updateCategoryController.handle.bind(updateCategoryController));
// router.delete("/category/:id", deleteCategoryController.handle.bind(deleteCategoryController));

// //PriceGroup
// router.post("/pricegroup", createPriceGroupController.handle.bind(createPriceGroupController));
// router.get("/pricegroup", listPriceGroupController.handle.bind(listPriceGroupController));
// router.put("/pricegroup/:id", updatePriceGroupController.handle.bind(updatePriceGroupController));
// router.delete("/pricegroup/:id", deletePriceGroupController.handle.bind(deletePriceGroupController));