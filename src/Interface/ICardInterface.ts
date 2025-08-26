interface ICardRequest {
    id: number;
    cardNumber: string;
    cardHolderName: string;
    cardExpirationDate: string;
    cardCVV: string;
    cardBrand: string;
    preferredCard: boolean;
}

export {ICardRequest};