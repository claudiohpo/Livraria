interface IShippingService {
  calculateQuote(payload: {
    fromPostalCode?: string;
    toPostalCode: string;
    cartItems: Array<{
      bookId: number;
      quantity: number;
      dimensions: { height: number; width: number; depth: number; weight: number };
      price: number;
    }>;
  }): Promise<{
    services: any;
    lowestPrice?: number | null;
    raw?: any;
  }>;

  createShipment?(params: {
    saleId: number;
    freightValue: number;
    trackingCode?: string | null;
    carrier?: string | null;
    serviceName?: string | null;
  }): Promise<any>;
}

export { IShippingService };
