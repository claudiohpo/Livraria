import { Router } from "express";

import { CreateBookController } from "../controller/book/CreateBookController";
import { ListBookController } from "../controller/book/ListBookController";
import { GetBookByIdController } from "../controller/book/GetBookByIdController";


const router = Router();

const createBookController = new CreateBookController();
const listBookController = new ListBookController();
const getBookByIdController = new GetBookByIdController();


router.post("/", createBookController.handle.bind(createBookController));
router.get("/", listBookController.handle.bind(listBookController));
router.get("/:id", getBookByIdController.handle.bind(getBookByIdController));


export default router;