interface ICouponRequest {
  code: string;                // código único do cupom
  value: number;               // valor do cupom
  validity?: string;           // data de validade em formato ISO (ex: "2025-12-31")
  type?: "PROMO" | "EXCHANGE"; // restringindo aos tipos definidos na entidade
  minPurchaseValue?: number;   // valor mínimo de compra para uso
  saleUsedId?: number;         // id da venda em que foi usado (opcional)
  used?: boolean;              // pode ser enviado, mas default é false
}
export { ICouponRequest };