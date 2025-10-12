import {Request, Response} from "express";
import { ListAddressService } from "../../service/Address/ListAddressService";

export class ListAddressController {
    async handle(request: Request, response: Response) {
        try {
            const costumerId = request.params.costumerId;
            const service = new ListAddressService();
            const addresses = await service.execute(costumerId);
            return response.json(addresses);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({message: error.message});
            }
            return response.status(500).json({message: "Erro interno dos servidor"});
        }
    }
}