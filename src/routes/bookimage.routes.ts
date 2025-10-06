import {Router} from "express";

import { CreateBookImageController } from "../controller/book/CreateBookImageController";
import { ListBookImageController } from "../controller/book/ListBookImageController";
import { UpdateBookImageController } from "../controller/book/UpdateBookImageController";
import { DeleteBookImageController } from "../controller/book/DeleteBookImageController";

const router = Router();

const createBookImageController = new CreateBookImageController();
const listBookImageController = new ListBookImageController();
const updateBookImageController = new UpdateBookImageController();
const deleteBookImageController = new DeleteBookImageController();

router.post("/book/:bookId/images", createBookImageController.handle.bind(createBookImageController));
router.get("/book/:bookId/images", listBookImageController.handle.bind(listBookImageController));
router.put("/images/:id", updateBookImageController.handle.bind(updateBookImageController));
router.delete("/images/:id", deleteBookImageController.handle.bind(deleteBookImageController));

router.get("/images", listBookImageController.handle.bind(listBookImageController));

export default router;