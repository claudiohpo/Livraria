interface ICreateCartRequest {
  clienteId?: number | null;
}

interface IUpdateCartRequest {
  active?: boolean;
  appliedDiscount?: number;
  couponAppliedId?: string | null;
  clienteId?: string | null;
}

export { ICreateCartRequest, IUpdateCartRequest };
