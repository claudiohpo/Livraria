import { getCustomRepository } from "typeorm";
import bcrypt from "bcryptjs";
import { CostumersRepositories } from "../../repositories/CostumersRepositories";
import { ICostumerRequest } from "../../Interface/ICostumerInterface";
import { CreateCreditCardService } from "../CreditCard/CreateCreditCardService";
import { CreateAddressService } from "../Address/CreateAddressService";
import { Costumer } from "../../entities/Costumer";

export class CreateCostumerService {
  async execute(data: ICostumerRequest) {
    const costumersRepo = getCustomRepository(CostumersRepositories);

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
      card,
    } = data;

    // RN0026 - validações básicas
    if (!name || !email || !password || !cpf || !phone || !birthdaydate || !gender) {
      throw new Error(
        "Campos obrigatórios ausentes. São obrigatórios: name, email, password, cpf, phone, birthdaydate e gender."
      );
    }

    // RNF0031 - senha forte
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      throw new Error(
        "Senha fraca. A senha deve ter ao menos 8 caracteres, incluir letras maiúsculas, minúsculas, números e caracteres especiais."
      );
    }

    // RNF0032 - confirmação de senha
    if (!passwordConfirmation || password !== passwordConfirmation) {
      throw new Error("Confirmação de senha inválida ou ausente. As senhas devem corresponder.");
    }

    // requisitar obrigatoriedade: 1 billing, 1 delivery, 1 card
    if (!Array.isArray(billingAddress) || billingAddress.length === 0)
      throw new Error("É obrigatório informar ao menos 1 endereço de cobrança (billingAddress).");
    if (!Array.isArray(deliveryAddress) || deliveryAddress.length === 0)
      throw new Error("É obrigatório informar ao menos 1 endereço de entrega (deliveryAddress).");
    if (!Array.isArray(card) || card.length === 0) throw new Error("É obrigatório informar ao menos 1 cartão de crédito.");

    // valida campos de endereço (RN0023)
    const requiredAddressFields = [
      "residenceType",
      "streetType",
      "street",
      "number",
      "neighborhood",
      "zipCode",
      "city",
      "state",
    ];
    for (const addr of (billingAddress as any[]).concat(deliveryAddress as any[])) {
      for (const f of requiredAddressFields) {
        if (!addr[f] || ("" + addr[f]).trim() === "") {
          throw new Error(`Endereço incompleto: campo ${f} é obrigatório em todos os endereços.`);
        }
      }
    }

    // RN0024 / RN0025 - validação cartões
    const ALLOWED_CARD_BRANDS = ["VISA", "MASTERCARD", "AMEX", "ELO", "HIPER"];
    for (const c of card as any[]) {
      if (!c.cardNumber || !c.cardHolderName || !c.cardExpirationDate || !c.cardCVV || !c.cardBrand) {
        throw new Error(
          "Cartão incompleto. Campos obrigatórios: cardNumber, cardHolderName, cardExpirationDate, cardCVV, cardBrand."
        );
      }
      if (!ALLOWED_CARD_BRANDS.includes(String(c.cardBrand).toUpperCase())) {
        throw new Error(`Bandeira de cartão não permitida: ${c.cardBrand}. Permitidas: ${ALLOWED_CARD_BRANDS.join(", ")}`);
      }
    }

    // unicidade email / cpf
    const existingEmail = await costumersRepo.findOne({ where: { email } });
    if (existingEmail) throw new Error("E-mail já cadastrado.");
    const existingCpf = await costumersRepo.findOne({ where: { cpf: ("" + cpf).replace(/\D/g, "") } });
    if (existingCpf) throw new Error("CPF já cadastrado.");

    // RNF0033 - hash da senha
    const hashedPassword = await bcrypt.hash(password, 8);

    const costumerToCreate: Partial<Costumer> = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      cpf: ("" + cpf).replace(/\D/g, ""),
      phone: phone.trim(),
      // birthdaydate: new Date(birthdaydate),
      birthdaydate: birthdaydate.trim(),
      gender: gender.trim(),
      ranking: 0,
    };

    // criar + salvar: capturar retorno do save (garantir que saved é Costumer)
    const createdEntity = costumersRepo.create(costumerToCreate);
    const saved = (await costumersRepo.save(createdEntity)) as Costumer;

    // Persistir endereços (services atualizados recebem Costumer)
    const createAddressService = new CreateAddressService();
    for (const addr of billingAddress as any[]) {
      const a = { ...addr, type: "BILLING" } as any;
      await createAddressService.execute(a, saved);
    }
    for (const addr of deliveryAddress as any[]) {
      const a = { ...addr, type: "DELIVERY" } as any;
      await createAddressService.execute(a, saved);
    }

    // Persistir cartões (service atualizado aceita Costumer)
    const createCardService = new CreateCreditCardService();
    for (const c of card as any[]) {
      await createCardService.execute(c, saved);
    }

    // Recarregar cliente com relações
    const full = await costumersRepo.findOne({
      where: { id: saved.id },
      relations: ["addresses", "creditCards"],
    });

    if (full) {
      const asAny = full as any;
      delete asAny.password;
    }

    return full;
  }
}