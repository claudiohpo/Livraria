import { Router} from "express";

import { CreateBookController } from "../controller/book/CreateBookController";
import { ListBookController } from "../controller/book/ListBookController";
 

const router = Router();

const createBookController = new CreateBookController();
const listBookController = new ListBookController();


router.post("/", createBookController.handle.bind(createBookController));
router.get("/", listBookController.handle.bind(listBookController));


export default router;