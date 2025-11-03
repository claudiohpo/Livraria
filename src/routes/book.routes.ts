import { Router } from "express";

import { CreateBookController } from "../controller/book/CreateBookController";
import { ListBookController } from "../controller/book/ListBookController";
import { GetBookByIdController } from "../controller/book/GetBookByIdController";
import { DeleteBookController } from "../controller/book/DeleteBookController";
import { UpdateBookController } from "../controller/book/UpdateBookController";

const router = Router();

const createBookController = new CreateBookController();
const listBookController = new ListBookController();
const getBookByIdController = new GetBookByIdController();
const deleteBookController = new DeleteBookController();
const updateBookController = new UpdateBookController();

router.post("/", createBookController.handle.bind(createBookController));
router.get("/", listBookController.handle.bind(listBookController));
router.get("/:id", getBookByIdController.handle.bind(getBookByIdController));
router.delete("/:id", deleteBookController.handle.bind(deleteBookController));
router.put("/:id", updateBookController.handle.bind(updateBookController));

export default router;