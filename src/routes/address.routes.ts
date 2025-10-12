import { Router } from "express";
import { CreateAddressController } from "../controller/address/CreateAddressController";
import { ListAddressController } from "../controller/address/ListAddressController";
import { DeleteAddressController } from "../controller/address/DeleteAddressController";
import { UpdateAddressController } from "../controller/address/UpdateAddressController";

const router = Router();

const createAddressController = new CreateAddressController();
const listAddressController = new ListAddressController();
const deleteAddressController = new DeleteAddressController();
const updateAddressController = new UpdateAddressController();

router.post("/", createAddressController.handle.bind(createAddressController)); 
router.get("/:costumerId", listAddressController.handle.bind(listAddressController));
router.delete("/:id", deleteAddressController.handle.bind(deleteAddressController));
router.put("/:id", updateAddressController.handle.bind(updateAddressController));

export default router;