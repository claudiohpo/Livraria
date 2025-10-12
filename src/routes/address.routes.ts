import { Router } from "express";
import { CreateAddressController } from "../controller/address/CreateAddressController";

const router = Router();

const createAddressController = new CreateAddressController();

router.post("/", createAddressController.handle.bind(createAddressController)); 

export default router;