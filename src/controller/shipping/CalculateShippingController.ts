import { Request, Response } from "express";
import { ShippingService } from "../../service/Shipping/ShippingService";

export class CalculateShippingController {
    async handle(req: Request, res: Response) {
        try {
            const { fromPostalCode, toPostalCode, cartItems } = req.body;

            // Validação mínima — se preferir mover totalmente para Service, remova estas checagens
            if (!toPostalCode) {
                return res.status(400).json({ error: "toPostalCode é obrigatório" });
            }
            if (!Array.isArray(cartItems) || cartItems.length === 0) {
                return res.status(400).json({ error: "cartItems (array) é obrigatório" });
            }

            const shippingService = new ShippingService();
            const result = await shippingService.calculateQuote({
                fromPostalCode,
                toPostalCode,
                cartItems,
            });

            return res.json(result);
        } catch (err: any) {
            console.error("CalculateShippingController error:", err);
            return res.status(500).json({ error: err.message ?? "Erro ao calcular frete" });
        }
    }
}
