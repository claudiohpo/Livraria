interface ICardRequest {
    id: number;
    cardnumber: string;
    cardholdername: string;
    cardexpirationdate: string;
    cardcvv: string;
    brand: string;
    preferredCard: boolean;
    clientId: number; //vinculado a um cliente
}

//export {ICardRequest};