//Define as rotas da API.

import { Router} from "express";

//Novo - LIVRARIA
//Book
import { CreateBookController } from "./controller/book/CreateBookController"; 

//Category
import { CreateCategoryController } from "./controller/category/CreateCategoryController";
import { ListCategoryController } from "./controller/category/ListCategoryController";
import { UpdateCategoryController } from "./controller/category/UpdateCategoryController";
import { DeleteCategoryController } from "./controller/category/DeleteCategoryController";

//Antigo, pagar daqui pra baixo
import { CreateProductController } from "./controller/product/CreateProductController";
import { ListProductController } from "./controller/product/ListProductController"; 
import { UpdateProductController } from "./controller/product/UpdateProductController";
import { DeleteProductController } from "./controller/product/DeleteProductController";


//Novo - LIVRARIA
//Book
const createBookController = new CreateBookController();
// const listBooksController = new ListBooksController();
// const updateBooksController = new UpdateBooksController();
// const deleteBooksController = new DeleteBooksController();

//Category
const createCategoryController = new CreateCategoryController();
const listCategoryController = new ListCategoryController();
const updateCategoryController = new UpdateCategoryController();
const deleteCategoryController = new DeleteCategoryController();

//Antigo, apagar daqui pra baixo
const createProductController = new CreateProductController();
const listProductController = new ListProductController();
const updateProductController = new UpdateProductController();
const deleteProductController = new DeleteProductController();

const router = Router();

//Novo - LIVRARIA
//Book
router.post("/book", createBookController.handle.bind(createBookController));

//Category
router.post("/category", createCategoryController.handle.bind(createCategoryController));
router.get("/category", listCategoryController.handle.bind(listCategoryController));
router.put("/category/:id", updateCategoryController.handle.bind(updateCategoryController));
router.delete("/category/:id", deleteCategoryController.handle.bind(deleteCategoryController));

//Antigo, apagar daqui pra baixo
router.post("/product", createProductController.handle.bind(createProductController));
router.get("/product", listProductController.handle);   
router.put("/product/:id", updateProductController.handle);
router.delete("/product/:id", deleteProductController.handle);

export {router};