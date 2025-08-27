import { getCustomRepository } from "typeorm";
import { CostumersRepositories } from "../../repositories/CostumersRepositories";
import { AddressesRepositories } from "../../repositories/AddressesRepositories"; //criar
import { CreditCardsRepositories } from "../../repositories/CreditCardsRepositories";
import { ICostumerRequest } from "../../Interface/ICostumerInterface"; //Talvez importar Address e Card Interfaces
// import { CreateAdressService
// import { CreateCreditCardService    }
import { Address } from "../../entities/Address";
import bcrypt from "bcryptjs";



export class CreateCostumerService {
    async execute(data: ICostumerRequest){
        const costumersRepo = getCustomRepository(CostumersRepositories)
        const addressesRepo = getCustomRepository(AddressesRepositories) //criar
        const cardRepo = getCustomRepository(CreditCardsRepositories) //criar

        const {
            name,
            email,
            password,
            passwordConfirmation,
            cpf,
            phone,
            birthdaydate,
            gender,
            billingAddress,
            deliveryAddress,
            card = [],
        } = data;

        // RN0026 - Dados obrigatórios para cadastro de cliente
        if (!name || !email || !password || !cpf || !phone || !birthdaydate || !gender || !billingAddress || !deliveryAddress || !card) {
            throw new Error("Todos os campos são obrigatórios");
        }

        // RNF0031 - Senha forte
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if(!strongPasswordRegex.test(password)){
            throw new Error("A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, minúscula, número e caracter especial.");
        }

        // RNF0032 - Confirmação de senha
        if (password !== passwordConfirmation) {
            throw new Error("Senha de confirmação não confere, corrija e tente novamente.");
        }

        // RNF0033 - Criptografar Senha
        const hashedPassword = await bcrypt.hash(password, 8);

        //Validação de email e CPF cadastrado
        const existingEmail = await costumersRepo.findOne({ where: { email } });
        if (existingEmail) {
            throw new Error("Email já cadastrado.");
        }

        const existingCPF = await costumersRepo.findOne({ where: { cpf:("" + cpf).replace(/\D/g, "") } });
        if (existingCPF) {
            throw new Error("CPF já cadastrado.");
        }

        // Validação de campos dos endereços (RN0023)
        const requiredAddressFields = [
            "residenceType",
            "streetType",
            "street",
            "number",
            "complement",
            "neighborhood",
            "city",
            "state",
            "zipCode"
        ];

        for (const address of (billingAddress as any[]).concat(deliveryAddress as any[])) {
            for (const field of requiredAddressFields) {
                if (!address[field] || ("" + address[field]).trim() === "") {
                    throw new Error(`O campo ${field} é obrigatório para os endereços.`);
                }
            }
        }

        // RN0024 / RN0025 - Validação de cartões (bandeira permitida)
        const ALLOWED_CARD_BRANDS = ["Visa", "MasterCard", "Amex", "Elo", "Hiper"];
        for (const c of card as any[]){
            if (!c.cardNumber || !c.cardHolderName || !c.cardExpirationDate || !c.cardCVV || !c.cardBrand){
                throw new Error("Campos obrigatórios do cartão não preenchidos.")
            }
            if (!ALLOWED_CARD_BRANDS.includes(String(c.cardBrand).toUpperCase())) {
                throw new Error(`A bandeira do cartão ${c.cardBrand} não é permitida. Permitidas: ${ALLOWED_CARD_BRANDS.join(", ")}`);
            }
        }

        
    }
}