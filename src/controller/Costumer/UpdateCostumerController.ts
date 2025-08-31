import { Request, Response } from "express";
import { UpdateCostumerService } from "../../service/Costumer/UpdateCostumerService";

export class UpdateCostumerController {
    async handle(request: Request, response: Response) {
        try{
            const {id} = request.params;
            const payload = request.body;
            
            const service = new UpdateCostumerService();
            const servupdated = await service.execute(Number(id), payload);

            return response.status(200).json(servupdated);
        }catch(error){
            if(error instanceof Error){
                return response.status(400).json({ error: error.message });
            }
            return response.status(500).json({ error: "Internal server error" });
        }
    }
}