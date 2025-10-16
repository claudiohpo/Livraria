import { getManager } from "typeorm";
import { Shipment } from "../../entities/Shipment";
import { ShipmentsRepositories } from "../../repositories/ShipmentsRepositories";
import { SalesRepositories } from "../../repositories/SalesRepositories";

function getFetch() {
  if (typeof (globalThis as any).fetch === "function") return (globalThis as any).fetch.bind(globalThis);
  try {
    const nodeFetch = require("node-fetch");
    return nodeFetch;
  } catch (e) {
    throw new Error("fetch não disponível. Atualize o Node para >=18 ou instale 'node-fetch' (npm i node-fetch).");
  }
}

export class ShippingService {
  private token: string;
  private baseUrl: string;
  private originPostalCode: string;
  private userAgent: string;
  private fetchImpl: any;

  constructor() {
    this.token = process.env.MELHOR_ENVIO_TOKEN || "";
    this.originPostalCode = process.env.MELHOR_ENVIO_ORIGIN_POSTAL_CODE || "";
    const env = (process.env.MELHOR_ENVIO_ENV || "sandbox").toLowerCase();
    this.baseUrl = env === "production"
      ? "https://api.melhorenvio.com.br/api/v2"
      : "https://sandbox.melhorenvio.com.br/api/v2";

    this.userAgent = process.env.APP_USER_AGENT || "myapp/1.0 (+contato@seudominio)";

    this.fetchImpl = getFetch();
  }

  private headers() {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": this.userAgent,
    };
    if (this.token && this.token.trim() !== "") {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  packItems(cartItems: Array<any>) {
    return cartItems.map((it: any, idx: number) => {
      const dims = it.dimensions || {};
      const width = Math.max(1, Number(dims.width || 1));
      const height = Math.max(1, Number(dims.height || 1));
      const length = Math.max(1, Number(dims.depth || dims.length || 1));
      // const weight = Math.max(0.01, Number(dims.weight || 0.1));
      const weight = Math.max(0.01, Number(dims.weight || 100) / 1000);

      return {
        id: String(it.bookId ?? idx),
        width,
        height,
        length,
        weight,
        quantity: Number(it.quantity || 1),
        insurance_value: Number(it.price || 0),
      };
    });
  }

  async calculateQuote({
    fromPostalCode,
    toPostalCode,
    cartItems,
  }: {
    fromPostalCode?: string;
    toPostalCode: string;
    cartItems: Array<any>;
  }) {
    const from = (fromPostalCode || this.originPostalCode || "").replace(/\D/g, "");
    const to = (toPostalCode || "").replace(/\D/g, "");
    const products = this.packItems(cartItems);

    const payload = {
      from: { postal_code: from },
      to: { postal_code: to },
      products,
      options: { receipt: false, own_hand: false },
    };

    const url = `${this.baseUrl}/me/shipment/calculate`;

    let respJson: any;
    try {
      const resp = await this.fetchImpl(url, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify(payload),
      });

      const text = await resp.text();
      try {
        respJson = JSON.parse(text);
      } catch (e) {
        respJson = text;
      }

      if (!resp.ok) {
        const bodyStr = typeof respJson === "object" ? JSON.stringify(respJson) : String(respJson);
        if (resp.status === 401 || resp.status === 403) {
          throw new Error(`Erro ao calcular frete: ${bodyStr} (HTTP ${resp.status}). Verifique MELHOR_ENVIO_TOKEN e User-Agent.`);
        }
        throw new Error(`Erro ao calcular frete: ${bodyStr} (HTTP ${resp.status}).`);
      }
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      throw new Error(`Erro ao calcular frete: ${msg}`);
    }

    // Normalizar services e lowestPrice
    const services = Array.isArray(respJson) ? respJson : respJson?.result ?? respJson?.services ?? respJson;
    let lowest: number | null = null;
    if (Array.isArray(services)) {
      for (const s of services) {
        const p = Number(s.custom_price ?? s.price ?? s.price_total ?? 0);
        if (!isNaN(p) && (lowest === null || p < lowest)) lowest = p;
      }
    }

    return { services, lowestPrice: lowest, raw: respJson };
  }

  /**
   * Recebe saleId e dados do serviço escolhido (valor do frete, carrier, serviceName, trackingCode)
   * Cria shipment e atualiza a venda (freightValue).
   */
  async createShipment({
    saleId,
    freightValue,
    trackingCode,
    carrier,
    serviceName,
  }: {
    saleId: number;
    freightValue: number;
    trackingCode?: string | null;
    carrier?: string | null;
    serviceName?: string | null;
  }) {
    const manager = getManager();
    const shipRepo = manager.getCustomRepository(ShipmentsRepositories);
    const salesRepo = manager.getCustomRepository(SalesRepositories);

    const ent = shipRepo.create({
      saleId,
      freightValue,
      trackingCode: trackingCode ?? null,
      carrier: carrier ?? null,
      serviceName: serviceName ?? null,
    } as Shipment);

    const saved = await shipRepo.save(ent);

    const sale = await salesRepo.findOne({ where: { id: Number(saleId) } as any });
    if (sale) {
      (sale as any).freightValue = Number(freightValue || 0);
      await salesRepo.save(sale);
    }

    return saved;
  }
}
