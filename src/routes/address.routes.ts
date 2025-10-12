import { Router } from "express";
import { CreateAddressController } from "../controller/address/CreateAddressController";
import { ListAddressController } from "../controller/address/ListAddressController";

const router = Router();

const createAddressController = new CreateAddressController();
const listAddressController = new ListAddressController();

router.post("/", createAddressController.handle.bind(createAddressController)); 
router.get("/:costumerId", listAddressController.handle.bind(listAddressController));

export default router;