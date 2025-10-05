import { Request, Response } from "express";
import { ListInventoryService } from "../../service/Inventory/ListInventoryService";

class ListInventoryController {
  async handle(request: Request, response: Response) {
    const { bookId } = request.query;
    const service = new ListInventoryService();
    try {
      const entries = await service.execute({ bookId: bookId as string | undefined });
        return response.json(entries);
    } catch (err: any) {
      if (err instanceof Error) return response.status(400).json({ message: err.message });
      return response.status(500).json({ message: "Internal server error" });
    }
    }
}

export { ListInventoryController };