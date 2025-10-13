import { Router } from "express";

import { CreateCategoryController } from "../controller/category/CreateCategoryController";
import { ListCategoryController } from "../controller/category/ListCategoryController";
import { UpdateCategoryController } from "../controller/category/UpdateCategoryController";
import { DeleteCategoryController } from "../controller/category/DeleteCategoryController";

const router = Router();

const createCategoryController = new CreateCategoryController();
const listCategoryController = new ListCategoryController();
const updateCategoryController = new UpdateCategoryController();
const deleteCategoryController = new DeleteCategoryController();

router.post("/", createCategoryController.handle.bind(createCategoryController));
router.get("/", listCategoryController.handle.bind(listCategoryController));
router.put("/:id", updateCategoryController.handle.bind(updateCategoryController));
router.delete("/:id", deleteCategoryController.handle.bind(deleteCategoryController));

export default router;