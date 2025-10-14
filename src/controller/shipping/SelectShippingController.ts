import { Request, Response } from "express";
import { CreateShipmentService } from "../../service/Shipping/CreateShipmentService";

export class SelectShippingController {
    async handle(req: Request, res: Response) {
        try {
            // Duas formas aceitas:
            // 1) enviar os campos diretos: { saleId, freightValue, carrier, serviceName, trackingCode? }
            // 2) enviar selectedService: { saleId, selectedService: { price, carrier, name, id } }
            const { saleId, freightValue, carrier, serviceName, trackingCode, selectedService } = req.body;

            if (!saleId) return res.status(400).json({ error: "saleId é obrigatório" });

            let fv = freightValue;
            let carr = carrier;
            let sname = serviceName;
            let track = trackingCode ?? null;

            if (selectedService) {
                fv = fv ?? (selectedService.price ?? selectedService.value ?? selectedService.custom_price ?? selectedService.price_total);
                carr = carr ?? (selectedService.carrier ?? selectedService.sender ?? selectedService.service_name ?? selectedService.name);
                sname = sname ?? (selectedService.service_name ?? selectedService.name ?? selectedService.service);
            }

            if (typeof fv === "undefined" || fv === null) {
                return res.status(400).json({ error: "freightValue (valor do frete) é obrigatório" });
            }

            const svc = new CreateShipmentService();
            const shipment = await svc.execute({
                saleId: Number(saleId),
                freightValue: Number(fv),
                carrier: carr ?? null,
                serviceName: sname ?? null,
                trackingCode: track,
            });

            return res.status(201).json(shipment);
        } catch (err: any) {
            console.error("SelectShippingController:", err);
            return res.status(500).json({ error: err.message || "Erro ao selecionar serviço" });
        }
    }
}
