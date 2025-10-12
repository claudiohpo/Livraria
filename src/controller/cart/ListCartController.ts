import { Request, Response } from "express";
import { ListCartService } from "../../service/Cart/ListCartService";

class ListCartController {
  async handle(request: Request, response: Response) {
    const { clienteId } = request.params;
    const { active } = request.query;

    const service = new ListCartService();
    try {
      const carts = await service.execute(
        clienteId,
        active === undefined ? true : active === "true"
      );
      return response.json(carts);
    } catch (err: any) {
      if (err instanceof Error) {
        return response.status(400).json({ message: err.message });
      }
      return response
        .status(500)
        .json({ message: "Internal server error" });
    }
  }
}

export { ListCartController };