export class PaymentGatewayService {
  /**
    * Captura simulada de pagamentos com cartão.
    * Por enquanto simula aprovação na maioria dos casos, mas retorna falso se qualquer número de cartão terminar com '0000' para simular falha.
    * Em produção, substituir pela integração real com o provedor e webhooks.
    */

  async captureCardPayment(cardInfo: { cardId?: string; number?: string; amount: number }) {
    // Simula falha se for usado um número de teste explícito
    if (cardInfo.number && cardInfo.number.endsWith("0000")) return { approved: false, message: "Card declined by issuer" };
    return { approved: true, message: "Approved" };
  }

  // Captura em lote
  async captureAll(payments: Array<{ cardId?: string; number?: string; amount: number }>) {
    for (const p of payments) {
      const res = await this.captureCardPayment(p);
      if (!res.approved) return { approved: false, message: res.message };
    }
    return { approved: true, message: "All approved" };
  }
}
