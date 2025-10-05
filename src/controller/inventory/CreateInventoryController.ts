import { Request, Response } from "express";
import { CreateInventoryEntryService } from "../../service/Inventory/CreateInventoryEntryService";

class CreateInventoryController {
  async handle(request: Request, response: Response) {
    const payload = request.body;
    const service = new CreateInventoryEntryService();
    try {
      const entry = await service.execute(payload);
      return response.status(201).json(entry);
    } catch (err: any) {
      if (err instanceof Error) return response.status(400).json({ message: err.message });
      return response.status(500).json({ message: "Internal server error" });
    }
  }
}

export { CreateInventoryController };
