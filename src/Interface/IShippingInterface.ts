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
        persist?: boolean;
    }): Promise<{
        services: any;
        lowestPrice?: number;
        raw?: any;
        quoteId?: number;
    }>;

    createShipmentFromQuote(params: {
        saleId: number;
        quoteId: number;
        serviceId: string | number;
    }): Promise<any>;
}

export { IShippingService };
