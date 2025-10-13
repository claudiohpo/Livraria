interface ICouponRequest {
  code: string;
  value: number;
  validity?: string;
  type?: "PROMO" | "EXCHANGE";
  minPurchaseValue?: number;
  saleUsedId?: number;
  used?: boolean;
}
export { ICouponRequest };