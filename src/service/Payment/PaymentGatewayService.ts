export class PaymentGatewayService {
  /**
   * Mock capture of card payments.
   * For now simulates approval for most cases, but returns false if any card number ends with '0000' to simulate fail.
   * In production, replace with real provider integration and webhooks.
   */
  async captureCardPayment(cardInfo: { cardId?: string; number?: string; amount: number }) {
    // Simulate fail if explicit test number used
    if (cardInfo.number && cardInfo.number.endsWith("0000")) return { approved: false, message: "Card declined by issuer" };
    return { approved: true, message: "Approved" };
  }

  // Batch capture
  async captureAll(payments: Array<{ cardId?: string; number?: string; amount: number }>) {
    for (const p of payments) {
      const res = await this.captureCardPayment(p);
      if (!res.approved) return { approved: false, message: res.message };
    }
    return { approved: true, message: "All approved" };
  }
}
