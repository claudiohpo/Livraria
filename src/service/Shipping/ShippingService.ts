// import { getManager } from "typeorm";
// import { ShipmentQuote } from "../../entities/ShipmentQuote";
// import { Shipment } from "../../entities/Shipment";
// import { ShipmentQuotesRepositories } from "../../repositories/ShipmentQuotesRepositories";
// import { ShipmentsRepositories } from "../../repositories/ShipmentsRepositories";
// import { SalesRepositories } from "../../repositories/SalesRepositories";

// /**
//  * ShippingService - usa fetch para chamar MelhorEnvio
//  * Requisitos: process.env.MELHOR_ENVIO_TOKEN (Bearer token)
//  *             process.env.MELHOR_ENVIO_ORIGIN_POSTAL_CODE (CEP de origem, opcional)
//  *             process.env.MELHOR_ENVIO_ENV ('sandbox' ou 'production') opcional
//  *
//  * Atenção: a API do MelhorEnvio exige 'User-Agent' (ver docs).
//  * Docs: https://docs.melhorenvio.com.br/reference/calculo-de-fretes-por-produtos
//  */

// function getFetch() {
//   // Node 18+ tem fetch global; se não tiver, tente usar node-fetch dinamicamente
//   // Caso prefira instalar node-fetch, rode: npm i node-fetch
//   // e remova a lógica abaixo e importe diretamente.
//   // Aqui tentamos usar globalThis.fetch primeiro.
//   if (typeof (globalThis as any).fetch === "function") return (globalThis as any).fetch.bind(globalThis);
//   try {
//     // dynamic import of node-fetch for older Node versions
//     // eslint-disable-next-line @typescript-eslint/no-var-requires
//     const nodeFetch = require("node-fetch");
//     return nodeFetch;
//   } catch (e) {
//     throw new Error("fetch não disponível. Atualize o Node para >=18 ou instale 'node-fetch' (npm i node-fetch).");
//   }
// }

// export class ShippingService {
//   private token: string;
//   private baseUrl: string;
//   private originPostalCode: string;
//   private userAgent: string;
//   private fetchImpl: any;

//   constructor() {
//     this.token = process.env.MELHOR_ENVIO_TOKEN || "";
//     this.originPostalCode = process.env.MELHOR_ENVIO_ORIGIN_POSTAL_CODE || "";
//     const env = (process.env.MELHOR_ENVIO_ENV || "sandbox").toLowerCase();
//     this.baseUrl = env === "production"
//       ? "https://api.melhorenvio.com.br/api/v2"
//       : "https://sandbox.melhorenvio.com.br/api/v2";

//     // definir um User-Agent — troque para seu contato técnico/email se quiser
//     this.userAgent = process.env.APP_USER_AGENT || process.env.APP_USER_AGENT;

//     // validacao token: se quer forçar falha caso não tenha token, descomente a linha abaixo.
//     // if (!this.token) throw new Error("MELHOR_ENVIO_TOKEN não configurado no .env");

//     this.fetchImpl = getFetch();
//   }

//   private headers() {
//     const headers: Record<string, string> = {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       "User-Agent": this.userAgent,
//     };
//     if (this.token && this.token.trim() !== "") {
//       headers.Authorization = `Bearer ${this.token}`;
//     }
//     return headers;
//   }

//   packItems(cartItems: Array<any>) {
//     return cartItems.map((it: any, idx: number) => {
//       const dims = it.dimensions || {};
//       const width = Math.max(1, Number(dims.width || 1));
//       const height = Math.max(1, Number(dims.height || 1));
//       const length = Math.max(1, Number(dims.depth || dims.length || 1));
//       const weight = Math.max(0.01, Number(dims.weight || 0.1));
//       return {
//         id: String(it.bookId ?? idx),
//         width,
//         height,
//         length,
//         weight,
//         quantity: Number(it.quantity || 1),
//         insurance_value: Number(it.price || 0),
//       };
//     });
//   }

//   // calculateQuote: chama MelhorEnvio e (opcional) persiste a cotação
//   async calculateQuote({
//     fromPostalCode,
//     toPostalCode,
//     cartItems,
//     persist = false,
//   }: {
//     fromPostalCode?: string;
//     toPostalCode: string;
//     cartItems: Array<any>;
//     persist?: boolean;
//   }) {
//     const from = (fromPostalCode || this.originPostalCode || "").replace(/\D/g, "");
//     const to = (toPostalCode || "").replace(/\D/g, "");
//     const products = this.packItems(cartItems);

//     const payload = {
//       from: { postal_code: from },
//       to: { postal_code: to },
//       products,
//       options: { receipt: false, own_hand: false },
//     };

//     const url = `${this.baseUrl}/me/shipment/calculate`;

//     let respJson: any;
//     try {
//       const resp = await this.fetchImpl(url, {
//         method: "POST",
//         headers: this.headers(),
//         body: JSON.stringify(payload),
//       });

//       const text = await resp.text();
//       // tenta parsear JSON; se não for JSON, retorna texto bruto
//       try {
//         respJson = JSON.parse(text);
//       } catch (e) {
//         respJson = text;
//       }

//       if (!resp.ok) {
//         // respJson costuma ser objeto com { message: "Unauthenticated." } em 401
//         const bodyStr = typeof respJson === "object" ? JSON.stringify(respJson) : String(respJson);
//         if (resp.status === 401 || resp.status === 403) {
//           throw new Error(`Erro ao calcular frete: ${bodyStr} (HTTP ${resp.status}). Verifique MELHOR_ENVIO_TOKEN e User-Agent.`);
//         }
//         throw new Error(`Erro ao calcular frete: ${bodyStr} (HTTP ${resp.status}).`);
//       }
//     } catch (err: any) {
//       // se fetch falhar (network ou parse), propagar mensagem legível
//       const msg = err?.message ?? String(err);
//       throw new Error(`Erro ao calcular frete: ${msg}`);
//     }

//     // normalizar services e lowestPrice
//     const services = Array.isArray(respJson) ? respJson : respJson?.result ?? respJson?.services ?? respJson;
//     let lowest: number | null = null;
//     if (Array.isArray(services)) {
//       for (const s of services) {
//         const p = Number(s.custom_price ?? s.price ?? s.price_total ?? 0);
//         if (!isNaN(p) && (lowest === null || p < lowest)) lowest = p;
//       }
//     }

//     // persistir se solicitado
//     let savedId: number | undefined;
//     if (persist) {
//       const manager = getManager();
//       const quoteRepo = manager.getCustomRepository(ShipmentQuotesRepositories);
//       const ent = quoteRepo.create({
//         fromPostalCode: from,
//         toPostalCode: to,
//         services,
//         lowestPrice: lowest,
//       } as ShipmentQuote);
//       const saved = await quoteRepo.save(ent);
//       savedId = saved.id;
//     }

//     return { services, lowestPrice: lowest, raw: respJson, quoteId: savedId };
//   }

//   // cria shipment e atualiza venda
//   async createShipmentFromQuote({ saleId, quoteId, serviceId }: { saleId: number; quoteId: number; serviceId: string | number; }) {
//     const manager = getManager();
//     const quoteRepo = manager.getCustomRepository(ShipmentQuotesRepositories);
//     const shipRepo = manager.getCustomRepository(ShipmentsRepositories);
//     const salesRepo = manager.getCustomRepository(SalesRepositories);

//     const quote = await quoteRepo.findOne({ where: { id: Number(quoteId) } });
//     if (!quote) throw new Error("Cotação não encontrada");

//     const services = Array.isArray(quote.services) ? quote.services : (quote.services?.result || quote.services?.services || []);
//     let selected = services.find((s: any) => String(s.id) === String(serviceId) || String(s.service) === String(serviceId));
//     if (!selected && services.length > 0) selected = services[0];
//     if (!selected) throw new Error("Serviço não encontrado na cotação");

//     const price = Number(selected.custom_price ?? selected.price ?? selected.price_total ?? 0);
//     const carrier = selected.carrier ?? selected.sender ?? selected.service_name ?? selected.name ?? null;
//     const serviceName = selected.service_name ?? selected.name ?? selected.service ?? null;

//     const shipment = shipRepo.create({
//       saleId,
//       freightValue: price,
//       trackingCode: null,
//       carrier,
//       serviceName,
//     } as Shipment);
//     await shipRepo.save(shipment);

//     const sale = await salesRepo.findOne({ where: { id: Number(saleId) } as any });
//     if (sale) {
//       (sale as any).freightValue = Number(price || 0);
//       await salesRepo.save(sale);
//     }

//     quote.saleId = Number(saleId);
//     await quoteRepo.save(quote);

//     return { shipment, quote };
//   }
// }


import { getManager } from "typeorm";
import { Shipment } from "../../entities/Shipment";
import { ShipmentsRepositories } from "../../repositories/ShipmentsRepositories";
import { SalesRepositories } from "../../repositories/SalesRepositories";

/**
 * ShippingService - chama MelhorEnvio (ou outro provider) para calcular opções.
 * NÃO persiste cotações.
 *
 * Requisitos (env):
 *  - MELHOR_ENVIO_TOKEN (opcional, mas necessário para produção)
 *  - MELHOR_ENVIO_ORIGIN_POSTAL_CODE (opcional)
 *  - MELHOR_ENVIO_ENV ('sandbox' or 'production')
 *  - APP_USER_AGENT (opcional; recomendado)
 */

function getFetch() {
  if (typeof (globalThis as any).fetch === "function") return (globalThis as any).fetch.bind(globalThis);
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
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
      const weight = Math.max(0.01, Number(dims.weight || 0.1));
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

  /**
   * calculateQuote
   * Apenas consulta o provider e retorna as opções; NÃO persiste nada.
   */
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
   * createShipment - opcional helper interno caso queira usar diretamente o service
   * (Se preferir centralizar em CreateShipmentService, pode remover este método)
   *
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
