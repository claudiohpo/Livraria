import { Request, Response } from "express";
import { UpdateAddressService } from "../../service/Address/UpdateAddressService";

class UpdateAddressController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { residenceType, streetType, street, number, complement, neighborhood, city, state, zipCode, observations } = request.body;

    const updateService = new UpdateAddressService();
    try {
      const address = await updateService.execute({
        id: Number(id),
        residenceType,
        streetType,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipCode,
        observations,
      });
      return response.json(address);
    } catch (error) {
      if (error instanceof Error) return response.status(400).json({ message: error.message });
      return response.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}

export { UpdateAddressController };