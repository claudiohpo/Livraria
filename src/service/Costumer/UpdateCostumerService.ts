import { getCustomRepository, Not } from "typeorm";
import bcrypt from "bcryptjs";
import { CostumersRepositories } from "../../repositories/CostumersRepositories";
import { ICostumerRequest } from "../../Interface/ICostumerInterface";
import { AddressesRepositories } from "../../repositories/AddressesRepositories";
import { CreditCardsRepositories } from "../../repositories/CreditCardsRepositories";
import { Address, AddressType } from "../../entities/Address";
import { CreditCard } from "../../entities/CreditCard";


export class UpdateCostumerService {
  async execute(id: number, payload: Partial<ICostumerRequest>) {
    const costumerRepo = getCustomRepository(CostumersRepositories);
    const addressRepo = getCustomRepository(AddressesRepositories);
    const cardRepo = getCustomRepository(CreditCardsRepositories);

    console.log(`\n--- UpdateCostumerService START (id=${id}) ---`);

    // Busca o cliente
    const costumer = await costumerRepo.findOne({ where: { id }, relations: ["addresses", "creditCards"] });

    if (!costumer) {
      console.log("Client not found -> abort");
      throw new Error("Cliente não encontrado");
    }

    // DEBUG: mostra o payload recebido
    console.log("Payload recebido:", JSON.stringify(payload, null, 2));

    // Atualizar os campos simples
    if (payload.name !== undefined) costumer.name = String(payload.name).trim();
    if (payload.phone !== undefined) costumer.phone = String(payload.phone).trim();
    if (payload.gender !== undefined) costumer.gender = String(payload.gender).trim();
    // if (payload.birthdaydate !== undefined) costumer.birthdaydate = new Date(payload.birthdaydate as any);
    if (payload.birthdaydate !== undefined) costumer.birthdaydate = String(payload.birthdaydate).trim();

    // Verificação de e-mail
    if (payload.email !== undefined && String(payload.email).trim() !== "") {
      const newEmail = String(payload.email).trim().toLowerCase();
      const currentEmail = (costumer.email ?? "").toString().trim().toLowerCase();
      if (newEmail !== currentEmail) {
        const exists = await costumerRepo.findOne({ where: { email: newEmail, id: Not(costumer.id) } });
        if (exists) {
          console.log("Email conflict found:", exists.id);
          throw new Error("E-mail já cadastrado.");
        }
        costumer.email = newEmail;
      }
    }

    // Verificação de CPF
    if (payload.cpf && payload.cpf !== costumer.cpf) {
      const rawCpf = ("" + payload.cpf).replace(/\D/g, "");
      const exists = await costumerRepo.findOne({ where: { cpf: rawCpf, id: Not(costumer.id) } });
      if (exists) {
        console.log("CPF conflict found:", exists.id);
        throw new Error("CPF já cadastrado");
      }
      costumer.cpf = rawCpf;
    }

    // Troca de senha
    if (payload.password !== undefined) {
      const password = String(payload.password);
      const confirmation = String(payload.passwordConfirmation || "");
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!strongPasswordRegex.test(password)) {
        throw new Error("Senha fraca. Deve conter letras maiúsculas, minúsculas, números e caracteres especiais.");
      }
      if (!confirmation || password !== confirmation) {
        throw new Error("Confirmação de senha inválida.");
      }
      costumer.password = await bcrypt.hash(password, 8);
    }

    // Endereços
    const incomingAddresses: Array<Partial<Address> & { type: AddressType; id?: number }> = [
      ...(payload.billingAddress || []).map((a: any) => ({ ...a, type: "BILLING" as AddressType })),
      ...(payload.deliveryAddress || []).map((a: any) => ({ ...a, type: "DELIVERY" as AddressType })),
    ];

    console.log("incomingAddresses length:", incomingAddresses.length);

    if (incomingAddresses.length > 0) {
      const incomingIds = incomingAddresses.filter((a) => a.id !== undefined && a.id !== null).map((a) => Number(a.id));
      console.log("incoming address ids:", incomingIds);

      for (const addr of incomingAddresses) {
        console.log(`Processing address payload id=${addr.id ?? "(new)"} type=${addr.type} ...`);
        if (addr.id !== undefined && addr.id !== null) {
          // buscar do DB (trazendo costumer relation)
          const existingAddress = await addressRepo.findOne({
            where: { id: Number(addr.id) } as any,
            relations: ["costumer"],
          });
          console.log("existingAddress fetched:", existingAddress ? { id: existingAddress.id, type: existingAddress.type } : null);

          if (!existingAddress) {
            console.log(`Address id=${addr.id} not found in DB`);
            throw new Error(`Endereço id=${addr.id} não pertence ao cliente ou não existe.`);
          }

          if (!existingAddress.costumer || existingAddress.costumer.id !== costumer.id) {
            console.log(`Address id=${addr.id} does not belong to costumer id=${costumer.id}`);
            throw new Error(`Endereço id=${addr.id} não pertence ao cliente ou não existe.`);
          }

          // registra valores antigos para debug
          const before = {
            observations: existingAddress.observations,
            street: existingAddress.street,
            number: existingAddress.number,
          };
          console.log("Address before update:", before);

          // atualiza campos
          existingAddress.type = (String(addr.type).toUpperCase() as AddressType) || existingAddress.type;
          existingAddress.residenceType = addr.residenceType as any;
          existingAddress.streetType = addr.streetType as any;
          existingAddress.street = addr.street as any;
          existingAddress.number = addr.number as any;
          existingAddress.complement = (addr as any).complement ?? null;
          existingAddress.neighborhood = addr.neighborhood as any;
          existingAddress.city = addr.city as any;
          existingAddress.state = addr.state as any;
          existingAddress.zipCode = addr.zipCode as any;
          existingAddress.observations = (addr as any).observations ?? null;

          // salva e loga retorno
          const saved = (await addressRepo.save(existingAddress as any)) as unknown as Address;
          console.log(`Address saved id=${saved.id} updated_at=${(saved as any).updated_at ?? "(no updated_at)"} - new obs='${saved.observations}'`);
        } else {
          console.log("Creating new address:", addr);
          const newAddress = addressRepo.create({
            type: (String(addr.type).toUpperCase() as AddressType),
            residenceType: addr.residenceType,
            streetType: addr.streetType,
            street: addr.street,
            number: addr.number,
            complement: (addr as any).complement ?? null,
            neighborhood: addr.neighborhood,
            city: addr.city,
            state: addr.state,
            zipCode: addr.zipCode,
            observations: (addr as any).observations ?? null,
            costumer: costumer,
          } as any);

          const savedNew = (await addressRepo.save(newAddress as any)) as unknown as Address;
          console.log(`Address created id=${savedNew.id} observations='${savedNew.observations}'`);
        }
      }

      const billingAddCount = await addressRepo.count({ where: { costumer: { id: costumer.id }, type: "BILLING" } as any });
      const deliveryAddCount = await addressRepo.count({ where: { costumer: { id: costumer.id }, type: "DELIVERY" } as any });
      console.log("billingAddCount:", billingAddCount, "deliveryAddCount:", deliveryAddCount);
    } else {
      console.log("No incomingAddresses provided - skipping address sync.");
    }

    // Cartões
    if (payload.card && Array.isArray(payload.card)) {
      const incomingCardIds = (payload.card || []).filter((c: any) => c.id !== undefined && c.id !== null).map((c: any) => Number(c.id));
      console.log("incoming cards:", payload.card, "ids:", incomingCardIds);

      for (const c of payload.card as any[]) {
        console.log(`Processing card payload id=${c.id ?? "(new)"} brand=${c.cardBrand}`);
        // valida campos obrigatórios (breve)
        const required = ["cardNumber", "cardHolderName", "cardExpirationDate", "cardCVV", "cardBrand"];
        for (const f of required) {
          if (!c[f] || ("" + c[f]).trim() === "") {
            throw new Error("Cartão incompleto. Campos obrigatórios: cardNumber, cardHolderName, cardExpirationDate, cardCVV, cardBrand.");
          }
        }

        const brandUpper = String(c.cardBrand).toUpperCase();
        const ALLOWED = ["VISA", "MASTERCARD", "AMEX", "ELO", "HIPER"];
        if (!ALLOWED.includes(brandUpper)) {
          throw new Error(`Cartão com bandeira inválida. Permitidas: ${ALLOWED.join(", ")}`);
        }

        if (c.id !== undefined && c.id !== null) {
          const existingCard = await cardRepo.findOne({ where: { id: Number(c.id) } as any, relations: ["costumer"] });
          console.log("existingCard fetched:", existingCard ? { id: existingCard.id, brand: existingCard.cardBrand } : null);
          if (!existingCard) {
            console.log(`Card id=${c.id} not found`);
            throw new Error(`Cartão id=${c.id} não pertence ao cliente ou não existe.`);
          }
          if (!existingCard.costumer || existingCard.costumer.id !== costumer.id) {
            console.log(`Card id=${c.id} does not belong to costumer id=${costumer.id}`);
            throw new Error(`Cartão id=${c.id} não pertence ao cliente ou não existe.`);
          }

          // registra valores antigos para debug
          const beforeCard = { cardNumber: existingCard.cardNumber, cardBrand: existingCard.cardBrand };
          console.log("Card before:", beforeCard);

          existingCard.cardNumber = c.cardNumber;
          existingCard.cardHolderName = c.cardHolderName;
          existingCard.cardExpirationDate = new Date(c.cardExpirationDate);
          existingCard.cardCVV = c.cardCVV;
          existingCard.cardBrand = brandUpper;
          existingCard.preferredCard = Boolean(c.preferredCard);

          const savedCard = (await cardRepo.save(existingCard as any)) as unknown as CreditCard;
          console.log(`Card saved id=${savedCard.id} new brand=${savedCard.cardBrand}`);
        } else {
          const newCard = cardRepo.create({
            cardNumber: c.cardNumber,
            cardHolderName: c.cardHolderName,
            cardExpirationDate: new Date(c.cardExpirationDate),
            cardCVV: c.cardCVV,
            cardBrand: brandUpper,
            preferredCard: Boolean(c.preferredCard),
            costumer: costumer,
          } as any);

          const savedCard = (await cardRepo.save(newCard as any)) as unknown as CreditCard;
          console.log(`Card created id=${savedCard.id} brand=${savedCard.cardBrand}`);
        }
      }

    } else {
      console.log("No incoming cards provided - skipping card sync.");
    }

    // Salvar client, apenas campos escalares do cliente (evita regravar as relações com valores antigos)
    const updatePayload: any = {
      id: costumer.id,
      name: costumer.name,
      email: costumer.email,
      phone: costumer.phone,
      gender: costumer.gender,
      birthdaydate: costumer.birthdaydate,
      cpf: costumer.cpf,
      // só inclua password se foi alterada
    };
    if (costumer.password) {
      updatePayload.password = costumer.password;
    }

    // Usa save com um object plain (ou update)
    await costumerRepo.save(updatePayload);

    // Recarrega o cliente com relações atualizadas
    const fullyUpdated = await costumerRepo.findOne({
      where: { id: costumer.id },
      relations: ["addresses", "creditCards"],
    });
    console.log("Costumer saved (fields updated).");
    if (!fullyUpdated) throw new Error("Erro ao recarregar cliente atualizado.");

    console.log("--- UpdateCostumerService FINISH ---\n");
    const asAny = fullyUpdated as any;
    delete asAny.password;
    return asAny;
  }
}

