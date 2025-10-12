interface ISale {
  id?: number;
  status?: string;
  freightValue: number;
  trackingCode?: string;
  saleDate?: Date | string;
  deliveryDate?: Date | string;
  clienteId?: string;
  enderecoEntregaId?: string;
  total: number;
  discountApplied: number;
  couponUsedId?: string;
  items: { itemId: number; quantity: number; price: number }[];
  payments: { type: string; value: number; cardId?: string; couponId?: string; status?: string }[];
  
}
export { ISale };