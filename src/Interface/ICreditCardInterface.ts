interface ICreditCardRequest {
    id: number;
    cardNumber: string;
    cardHolderName: string;
    cardExpirationDate: string;
    cardCVV: string;
    cardBrand: string;
    preferredCard: boolean;
}

export { ICreditCardRequest };