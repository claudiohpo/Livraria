import { Request, Response } from "express";
import { ShippingService } from "../../service/Shipping/ShippingService";

export class QuoteShippingController {
    async handle(req: Request, res: Response) {
        try {
            const { toPostalCode, cartItems, fromPostalCode, persist } = req.body;
            if (!toPostalCode || !Array.isArray(cartItems)) {
                return res.status(400).json({ error: "toPostalCode e cartItems são obrigatórios" });
            }
            const svc = new ShippingService();
            const quote = await svc.calculateQuote({ fromPostalCode, toPostalCode, cartItems, persist: !!persist });
            return res.json(quote);
        } catch (err: any) {
            const msg = err?.message ?? String(err);
            console.error("QuoteShippingController: Error:", err);

            if (msg.includes("Unauthenticated") || msg.includes("MELHOR_ENVIO_TOKEN") || msg.includes("HTTP 401") || msg.includes("HTTP 403")) {
                return res.status(401).json({ error: msg });
            }
            return res.status(500).json({ error: msg });
        }


    }
}
