import { getCustomRepository } from "typeorm";
import { CostumersRepositories } from "../../repositories/CostumersRepositories";
import { ICostumerRequest } from "../../Interface/ICostumerInterface"; //Talvez importar Address e Card Interfaces
import bcrypt from "bcryptjs";


export class CreateCostumerService {
    async execute(data: ICostumerRequest){
        const costumersRepo = getCustomRepository(CostumersRepositories)
        //const addressRepo = getCustomRepository(AddressRepositories) //criar
        //const cardRepo = getCustomRepository(CardRepositories) //criar

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

        const existingCpf = await costumersRepo.findOne({ where: { cpf } });
        if (existingCpf) {
            throw new Error("CPF já cadastrado.");
        }

        
    }
}