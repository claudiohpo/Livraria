import { Router} from "express";

import { CreateBookController } from "../controller/book/CreateBookController";
 

const router = Router();

const createBookController = new CreateBookController();


router.post("/", createBookController.handle.bind(createBookController));


export default router;