import { IAddressRequest } from "./IAddressInterface";
import { ICardRequest } from "./ICardInterface";

interface ICostumerRequest {
    id: number;
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    cpf: string;
    phone: string;
    birthdaydate: Date;
    gender: string;
    billingAddress: IAddressRequest[]; //RN0021
    deliveryAddress: IAddressRequest[]; //RN0022
    card: ICardRequest[]; //RN0024
}

export {ICostumerRequest};