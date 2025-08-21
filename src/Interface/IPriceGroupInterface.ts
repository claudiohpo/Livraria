export interface IPriceGroupRequest {
  name: string;
  description?: string;
  margin: number; // ex.: 0.30 = 30%
  minAllowedMargin?: number; // ex.: 0.20 = 20%
  maxAllowedDiscount?: number; // ex.: 0.30 = 30%
  requiresManagerApprovalBelowMargin?: boolean;
  active?: boolean;
}
