interface IClientRequest {
    id: number;
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    cpf: string;
    phone: string;
    birthdaydate: Date;
    gender: string;
    ChargeAddress: IAddressRequest[]; //RN0021
    DeliveryAddress: IAddressRequest[]; //RN0022
    card: ICardRequest[]; //RN0024
}

export {IClientRequest};