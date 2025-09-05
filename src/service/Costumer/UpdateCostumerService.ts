// import { getCustomRepository } from "typeorm";
// import { CostumersRepositories } from "../../repositories/CostumersRepositories";
// import { ICostumerRequest } from "../../Interface/ICostumerInterface";
// import { AddressesRepositories } from "../../repositories/AddressesRepositories";
// import { CreditCardsRepositories } from "../../repositories/CreditCardsRepositories";
// import bcrypt from "bcryptjs";
// import { Not } from "typeorm";

// /**
//  * UpdateCostumerService
//  * - Permite atualizações parciais.
//  * - Sincroniza (upsert) endereços e cartões se enviados.
//  * - Garante regras de negócio:
//  *    RNF0031 (senha forte), RNF0032 (confirmação), RNF0033 (hash),
//  *    RN0021/RN0022/RN0023 (endereços obrigatórios/validação) para garantir consistência pós-update,
//  *    RF0034: é possível atualizar somente endereços sem alterar outros dados.
//  */

// export class UpdateCostumerService {
//     async execute(id: number, payload: Partial<ICostumerRequest>) {
//         const costumerRepo = getCustomRepository(CostumersRepositories);
//         const addressRepo = getCustomRepository(AddressesRepositories);
//         const cardRepo = getCustomRepository(CreditCardsRepositories);

//         // Busca o cliente
//         const costumer = await costumerRepo.findOne({ where: { id }, relations: ["addresses", "creditCards"] });

//         if (!costumer) {
//             throw new Error("Cliente não encontrado");
//         }

//         // Atualizar os campos simples
//         if (payload.name !== undefined) costumer.name = String(payload.name).trim();
//         if (payload.phone !== undefined) costumer.phone = String(payload.phone).trim();
//         if (payload.gender !== undefined) costumer.gender = String(payload.gender).trim();
//         if (payload.birthdaydate !== undefined) costumer.birthdaydate = new Date(payload.birthdaydate as any);

//         // Verificar unicidade do e-mail se for alterado
//         // if (payload.email && payload.email !== costumer.email) {
//         //     const exists = await costumerRepo.findOne({ where: { email: payload.email } });

//         //     if (exists) {
//         //         throw new Error("E-mail já cadastrado");
//         //     }

//         //     costumer.email = String(payload.email).trim().toLowerCase();
//         // }

//         if (payload.email !== undefined && String(payload.email).trim() !== "") {
//   const newEmail = String(payload.email).trim().toLowerCase();
//   const currentEmail = (costumer.email ?? "").toString().trim().toLowerCase();

//   // Só prossegue se o email novo for realmente diferente do atual
//   if (newEmail !== currentEmail) {
//     // Busca por outro cliente que tenha esse email (exclui o próprio cliente)
//     console.log("payload.email/newEmail:", payload.email, newEmail, "current:", currentEmail, "costumer.id:", costumer.id);
// const exists = await costumerRepo.findOne({ where: { email: newEmail, id: Not(costumer.id) } });
// console.log("exists:", exists);


//     if (exists) {
//       throw new Error("E-mail já cadastrado.");
//     }

//     // Atualiza com a versão normalizada
//     costumer.email = newEmail;
//   }
// }

//         //Verificar unicidade do CPF se for alterado
//         if (payload.cpf && payload.cpf !== costumer.cpf) {
//             const rawCpf = ("" + payload.cpf).replace(/\D/g, "");
//             const exists = await costumerRepo.findOne({ where: { cpf: rawCpf } });

//             if (exists) {
//                 throw new Error("CPF já cadastrado");
//             }

//             costumer.cpf = rawCpf;
//         }

//         //Troca de senha - |RNF0031 + RNF0032 + RNF0033|
//         if (payload.password !== undefined) {
//             const passwword = String(payload.password);
//             const passwordConfirmation = String(payload.passwordConfirmation || "");

//             //RNF0031 - Validação de senha forte
//             const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//             if (!strongPasswordRegex.test(passwword)) {
//                 throw new Error("A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.");
//             }

//             //RNF0032 - Validação de confirmação de senha
//             if (!passwordConfirmation || passwword !== passwordConfirmation) {
//                 throw new Error("Confirmação de senha inválida ou ausente. As senhas devem coincidir.");
//             }

//             //RNF0033 - Hash da senha
//             costumer.password = await bcrypt.hash(passwword, 8);
//         }

//         // -----------------------------
//         // Sincronizar endereços (se enviados)
//         // - comportamento: upsert (update/create/delete para sincronizar com o payload)
//         // - manter a regra: ao final, deve existir >=1 billing e >=1 delivery (RN0021/RN0022)
//         // -----------------------------

//         const incomingAddresses: any[] = [
//             ...(payload.billingAddress || []).map(addr => ({ ...addr, type: 'billing' })),
//             ...(payload.deliveryAddress || []).map(addr => ({ ...addr, type: 'delivery' })),
//         ];

//         if (incomingAddresses.length > 0) {
//             //map dos addresses recebidos - somente se tiver id
//             const incomingIds = incomingAddresses.filter(addr => addr.id).map(addr => Number(addr.id));

//             //Atualiza ou cria endereço
//             for (const addr of incomingAddresses) {
//                 if (addr.id) {
//                     // Atualiza endereço existente
//                     const existingAddress = await addressRepo.findOne({ where: { id: addr.id, costumer: { id: costumer.id } } as any });
//                     if (!existingAddress) throw new Error(`Endereço id=${addr.id} não pertence ao cliente ou não existe.`);

//                     //RN0023 - Validar Campos obrigatórios
//                     const required = ["residenceType", "streetType", "street", "number", "neighborhood", "city", "state", "zipCode"];
//                     for (const field of required) {
//                         if ((addr[field] === undefined) || (("" + addr[field]).trim() === "")) {
//                             throw new Error(`Endereço incompleto: campo '${field}' é obrigatório.`);
//                         }
//                     }
//                     Object.assign(existingAddress, {
//                         type: addr.type,
//                         residenceType: addr.residenceType,
//                         streetType: addr.streetType,
//                         street: addr.street,
//                         number: addr.number,
//                         complement: addr.complement ?? null,
//                         neighborhood: addr.neighborhood,
//                         city: addr.city,
//                         state: addr.state,
//                         zipCode: addr.zipCode,
//                         observations: addr.observations ?? null,
//                     });
//                     await addressRepo.save(existingAddress);
//                 } else {
//                     //Criar novo endereço
//                     const newAddress = addressRepo.create({
//                         type: addr.type,
//                         residenceType: addr.residenceType,
//                         streetType: addr.streetType,
//                         street: addr.street,
//                         number: addr.number,
//                         complement: addr.complement ?? null,
//                         neighborhood: addr.neighborhood,
//                         city: addr.city,
//                         state: addr.state,
//                         zipCode: addr.zipCode,
//                         observations: addr.observations ?? null,
//                         costumer: costumer, //{ id: costumer.id },
//                     });
//                     await addressRepo.save(newAddress);
//                 }
//             }

//             //Deletar endereço que está no banco mas não foi enviado no payload
//             const existingAddresses = await addressRepo.find({ where: { costumer: { id: costumer.id } } as any });
//             for (const addr of existingAddresses) {
//                 if (!incomingIds.includes(addr.id)) {
//                     // antes de remover verifique se não deixará faltar billing/delivery
//                     // contamos após a remoção hipotética
//                     // aqui simplificado: realize remoção e checagem pós-removal
//                     // ********************** VER ISSO ****************************************************
//                     await addressRepo.remove(addr);
//                 }
//             }

//             //Verificar se ainda existem endereços de cobrança e de entrega | Billing/Delivery >= 1
//             const billingAddCount = await addressRepo.count({ where: { costumer: { id: costumer.id }, type: 'billing' } as any });
//             const deliveryAddCount = await addressRepo.count({ where: { costumer: { id: costumer.id }, type: 'delivery' } as any });

//             if (billingAddCount === 0) throw new Error("Após as alterações, não há endereços de cobrança. Deve haver pelo menos um endereço de cobrança.");
//             if (deliveryAddCount === 0) throw new Error("Após as alterações, não há endereços de entrega. Deve haver pelo menos um endereço de entrega."); 
//         }

//         // -----------------------------
//         // Sincronizar cartões (se enviados)
//         // - Mesma estratégia: update/create/delete (replace)
//         // - Garantir que ao final exista >=1 cartão (RN0024 implicação solicitada)
//         // -----------------------------

//         if (payload.card && Array.isArray(payload.card)){
//             const incomingCardIds = (payload.card || []).filter(card => (card as any).id).map(card => Number((card as any).id));

//             for (const card of payload.card as any[]) {
//                 //Valida os campos do cartão
//                 const requiredCreditCardFields = ["cardNumber", "cardHolderName", "cardExpirationDate","cardCVV","cardBrand"];
//                 for (const field of requiredCreditCardFields) {
//                     if(!card[field] || ((""+card[field]).trim() === "")){
//                         throw new Error("Cartão incompleto. Campos obrigatórios: cardNumber, cardHolderName, cardExpirationDate, cardCVV, cardBrand.");
//                     }

//                 }

//                 //Bandeiras permitidas || RN0025
//                 const allowedCardBrands = ["VISA","MASTERCARD","AMEX","ELO","HIPER"];
//                 if(!allowedCardBrands.includes(String(card.cardBrand).toUpperCase())){
//                     throw new Error(`Cartão com bandeira inválida. Bandeiras permitidas: ${allowedCardBrands.join(", ")}`);
//                 }

//                 if (card.id) {
//                     //Atualizar cartão
//                     const existingCard = await cardRepo.findOne({ where: { id: card.id, costumer: { id: costumer.id } } as any });
//                     if(!existingCard) throw new Error(`Cartão id=${card.id} não pertence ao cliente ou não existe.`);
//                     Object.assign(existingCard,{
//                         cardNumber: card.cardNumber,
//                         cardHolderName: card.cardHolderName,
//                         cardExpirationDate: new Date(card.cardExpirationDate),
//                         cardCVV: card.cardCVV,
//                         cardBrand: card.cardBrand,
//                         preferredCard: Boolean(card.preferredCard),
//                     });
//                     await cardRepo.save(existingCard);
//                 } else {
//                     //Criar novo cartão
//                     const newCard = cardRepo.create({
//                         cardNumber: card.cardNumber,
//                         cardHolderName: card.cardHolderName,
//                         cardExpirationDate: new Date(card.cardExpirationDate),
//                         cardCVV: card.cardCVV,
//                         cardBrand: card.cardBrand,
//                         preferredCard: Boolean(card.preferredCard),
//                         costumer: costumer, //{ id: costumer.id },
//                     });
//                     await cardRepo.save(newCard);
//                 }
//             }

//             //Deletar os cartões que não vieram no payload - Replace
//             const existingCards = await cardRepo.find({ where: { costumer: { id: costumer.id } } as any });
//             for (const ex of existingCards) {
//                 if (!incomingCardIds.includes(ex.id)) {
//                     await cardRepo.remove(ex);
//                 }
//             }

//             // Garantir que ao final exista pelo menos 1 cartão
//             const cardCount = await cardRepo.count({ where: { costumer: { id: costumer.id } } as any });
//             if (cardCount  === 0) {
//                 throw new Error("É necessário ter pelo menos 1 cartão cadastrado.");
//             }
//         }    

//         // -----------------------------
//         // Salvar client (campos do client modificados)
//         // -----------------------------

//         await costumerRepo.save(costumer);

//         //Recarregar o cliente atualizado e remove senha de retorno
//         const fullyUpdated = await costumerRepo.findOne({ where: { id: costumer.id }, relations: ["addresses", "creditCards"] });
//         if (!fullyUpdated) throw new Error("Erro ao recarregar cliente atualizado.");

//         const asAny = fullyUpdated as any;
//         delete asAny.password;
//         return asAny;
//     }

// }

// //BLOCO 2

// import { getCustomRepository, Not } from "typeorm";
// import bcrypt from "bcryptjs";
// import { CostumersRepositories } from "../../repositories/CostumersRepositories";
// import { ICostumerRequest } from "../../Interface/ICostumerInterface";
// import { AddressesRepositories } from "../../repositories/AddressesRepositories";
// import { CreditCardsRepositories } from "../../repositories/CreditCardsRepositories";
// import { Address, AddressType } from "../../entities/Address";
// import { CreditCard } from "../../entities/CreditCard";

// /**
//  * UpdateCostumerService
//  * - Permite atualizações parciais.
//  * - Sincroniza (upsert) endereços e cartões se enviados.
//  * - Garante regras de negócio:
//  *    RNF0031 (senha forte), RNF0032 (confirmação), RNF0033 (hash),
//  *    RN0021/RN0022/RN0023 (endereços obrigatórios/validação) para garantir consistência pós-update,
//  *    RF0034: é possível atualizar somente endereços sem alterar outros dados.
//  *
//  * OBS: mantive seus comentários originais e acrescentei alguns logs para debug.
//  */

// export class UpdateCostumerService {
//   async execute(id: number, payload: Partial<ICostumerRequest>) {
//     const costumerRepo = getCustomRepository(CostumersRepositories);
//     const addressRepo = getCustomRepository(AddressesRepositories);
//     const cardRepo = getCustomRepository(CreditCardsRepositories);

//     // Busca o cliente
//     const costumer = await costumerRepo.findOne({ where: { id }, relations: ["addresses", "creditCards"] });

//     if (!costumer) {
//       throw new Error("Cliente não encontrado");
//     }

//     // DEBUG: mostra o payload recebido para ajudar no debug
//     console.log("DEBUG UpdateCostumerService payload:", JSON.stringify(payload, null, 2));

//     // Atualizar os campos simples
//     if (payload.name !== undefined) costumer.name = String(payload.name).trim();
//     if (payload.phone !== undefined) costumer.phone = String(payload.phone).trim();
//     if (payload.gender !== undefined) costumer.gender = String(payload.gender).trim();
//     if (payload.birthdaydate !== undefined) costumer.birthdaydate = new Date(payload.birthdaydate as any);

//     // Verificar unicidade do e-mail se for alterado (normaliza e ignora próprio registro)
//     if (payload.email !== undefined && String(payload.email).trim() !== "") {
//       const newEmail = String(payload.email).trim().toLowerCase();
//       const currentEmail = (costumer.email ?? "").toString().trim().toLowerCase();

//       // Só prossegue se o email novo for realmente diferente do atual
//       if (newEmail !== currentEmail) {
//         // Busca por outro cliente que tenha esse email (exclui o próprio cliente)
//         const exists = await costumerRepo.findOne({ where: { email: newEmail, id: Not(costumer.id) } });

//         if (exists) {
//           throw new Error("E-mail já cadastrado.");
//         }

//         // Atualiza com a versão normalizada
//         costumer.email = newEmail;
//       }
//     }

//     //Verificar unicidade do CPF se for alterado
//     if (payload.cpf && payload.cpf !== costumer.cpf) {
//       const rawCpf = ("" + payload.cpf).replace(/\D/g, "");
//       const exists = await costumerRepo.findOne({ where: { cpf: rawCpf, id: Not(costumer.id) } });

//       if (exists) {
//         throw new Error("CPF já cadastrado");
//       }

//       costumer.cpf = rawCpf;
//     }

//     //Troca de senha - |RNF0031 + RNF0032 + RNF0033|
//     if (payload.password !== undefined) {
//       const passwword = String(payload.password);
//       const passwordConfirmation = String(payload.passwordConfirmation || "");

//       //RNF0031 - Validação de senha forte
//       const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//       if (!strongPasswordRegex.test(passwword)) {
//         throw new Error(
//           "A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais."
//         );
//       }

//       //RNF0032 - Validação de confirmação de senha
//       if (!passwordConfirmation || passwword !== passwordConfirmation) {
//         throw new Error("Confirmação de senha inválida ou ausente. As senhas devem coincidir.");
//       }

//       //RNF0033 - Hash da senha
//       costumer.password = await bcrypt.hash(passwword, 8);
//     }

//     // -----------------------------
//     // Sincronizar endereços (se enviados)
//     // - comportamento: upsert (update/create/delete para sincronizar com o payload)
//     // - manter a regra: ao final, deve existir >=1 billing e >=1 delivery (RN0021/RN0022)
//     // -----------------------------

//     // Normalize payload keys and set type as UPPERCASE for consistency
//     // Tipamos incomingAddresses como Partial<Address> + explicit type
//     const incomingAddresses: Array<Partial<Address> & { type: AddressType; id?: number }> = [
//       ...(payload.billingAddress || []).map((addr: any) => ({ ...addr, type: "BILLING" as AddressType })),
//       ...(payload.deliveryAddress || []).map((addr: any) => ({ ...addr, type: "DELIVERY" as AddressType })),
//     ];

//     if (incomingAddresses.length > 0) {
//       console.log("Debug incomingAddresses:", incomingAddresses);

//       // ids que vieram no payload (numéricos)
//       const incomingIds: number[] = incomingAddresses.filter((a) => a.id !== undefined).map((a) => Number(a.id));
//       console.log("Debug incomingAddressIds:", incomingIds);

//       // Atualiza ou cria
//       for (const addr of incomingAddresses) {
//         if (addr.id !== undefined && addr.id !== null) {
//           // buscar o endereço explicitamente e trazer relação do costumer
//           const existingAddress: Address | undefined = await addressRepo.findOne({
//             where: { id: Number(addr.id) } as any,
//             relations: ["costumer"],
//           });
//           if (!existingAddress || !existingAddress.costumer || existingAddress.costumer.id !== costumer.id) {
//             throw new Error(`Endereço id=${addr.id} não pertence ao cliente ou não existe.`);
//           }

//           // valida campos obrigatórios (RN0023)
//           const required = ["residenceType", "streetType", "street", "number", "neighborhood", "city", "state", "zipCode"];
//           for (const field of required) {
//             if ((addr as any)[field] === undefined || ("" + (addr as any)[field]).trim() === "") {
//               throw new Error(`Endereço incompleto: campo '${field}' é obrigatório.`);
//             }
//           }

//           // cast seguro do type para AddressType
//           existingAddress.type = (String(addr.type).toUpperCase() as AddressType) || existingAddress.type;
//           existingAddress.residenceType = addr.residenceType as string;
//           existingAddress.streetType = addr.streetType as string;
//           existingAddress.street = addr.street as string;
//           existingAddress.number = addr.number as string;
//           existingAddress.complement = (addr as any).complement ?? null;
//           existingAddress.neighborhood = addr.neighborhood as string;
//           existingAddress.city = addr.city as string;
//           existingAddress.state = addr.state as string;
//           existingAddress.zipCode = addr.zipCode as string;
//           existingAddress.observations = (addr as any).observations ?? null;

//           await addressRepo.save(existingAddress);
//           console.log(`Address id=${existingAddress.id} atualizado.`);
//         } else {
//           // criar novo endereço
//           const newAddress = addressRepo.create({
//             type: (String(addr.type).toUpperCase() as AddressType),
//             residenceType: addr.residenceType,
//             streetType: addr.streetType,
//             street: addr.street,
//             number: addr.number,
//             complement: (addr as any).complement ?? null,
//             neighborhood: addr.neighborhood,
//             city: addr.city,
//             state: addr.state,
//             zipCode: addr.zipCode,
//             observations: (addr as any).observations ?? null,
//             costumer: costumer,
//           } as any);

//           // >>> CORREÇÃO TÍPICA: forçar o retorno para Address via unknown cast
//           const savedNew = (await addressRepo.save(newAddress as any)) as unknown as Address;
//           console.log(`Address id=${savedNew.id} criado.`);
//         }
//       }

//       // Deletar endereços que existem no banco mas não foram enviados no payload (replace behavior)
//       const existingAddresses: Address[] = await addressRepo.find({
//         where: { costumer: { id: costumer.id } } as any,
//       });
//       for (const ex of existingAddresses) {
//         if (!incomingIds.includes(Number(ex.id))) {
//           await addressRepo.remove(ex);
//           console.log(`Address id=${ex.id} removido por não constar no payload.`);
//         }
//       }

//       // Verificar counts usando UPPERCASE types
//       const billingAddCount = await addressRepo.count({
//         where: { costumer: { id: costumer.id }, type: "BILLING" } as any,
//       });
//       const deliveryAddCount = await addressRepo.count({
//         where: { costumer: { id: costumer.id }, type: "DELIVERY" } as any,
//       });

//       if (billingAddCount === 0)
//         throw new Error("Após as alterações, não há endereços de cobrança. Deve haver pelo menos um endereço de cobrança.");
//       if (deliveryAddCount === 0)
//         throw new Error("Após as alterações, não há endereços de entrega. Deve haver pelo menos um endereço de entrega.");
//     }

//     // -----------------------------
//     // Sincronizar cartões (se enviados)
//     // - Mesma estratégia: update/create/delete (replace)
//     // - Garantir que ao final exista >=1 cartão (RN0024 implicação solicitada)
//     // -----------------------------

//     if (payload.card && Array.isArray(payload.card)) {
//       const incomingCardIds: number[] = (payload.card || []).filter((c: any) => c.id !== undefined).map((c: any) => Number(c.id));
//       console.log("Debug incomingCards:", payload.card, "ids:", incomingCardIds);

//       for (const c of payload.card as any[]) {
//         // valida campos obrigatórios
//         const requiredCreditCardFields = ["cardNumber", "cardHolderName", "cardExpirationDate", "cardCVV", "cardBrand"];
//         for (const field of requiredCreditCardFields) {
//           if (!c[field] || ("" + c[field]).trim() === "") {
//             throw new Error("Cartão incompleto. Campos obrigatórios: cardNumber, cardHolderName, cardExpirationDate, cardCVV, cardBrand.");
//           }
//         }

//         // padroniza e verifica bandeira
//         const ALLOWED_CARD_BRANDS = ["VISA", "MASTERCARD", "AMEX", "ELO", "HIPER"];
//         const brandUpper = String(c.cardBrand).toUpperCase();
//         if (!ALLOWED_CARD_BRANDS.includes(brandUpper)) {
//           throw new Error(`Cartão com bandeira inválida. Bandeiras permitidas: ${ALLOWED_CARD_BRANDS.join(", ")}`);
//         }

//         if (c.id !== undefined && c.id !== null) {
//           const existingCard: CreditCard | undefined = await cardRepo.findOne({
//             where: { id: Number(c.id) } as any,
//             relations: ["costumer"],
//           });
//           if (!existingCard || !existingCard.costumer || existingCard.costumer.id !== costumer.id) {
//             throw new Error(`Cartão id=${c.id} não pertence ao cliente ou não existe.`);
//           }

//           existingCard.cardNumber = c.cardNumber;
//           existingCard.cardHolderName = c.cardHolderName;
//           existingCard.cardExpirationDate = new Date(c.cardExpirationDate);
//           existingCard.cardCVV = c.cardCVV;
//           existingCard.cardBrand = brandUpper;
//           existingCard.preferredCard = Boolean(c.preferredCard);

//           await cardRepo.save(existingCard);
//           console.log(`CreditCard id=${existingCard.id} atualizado.`);
//         } else {
//           // criar novo cartão
//           const newCard = cardRepo.create({
//             cardNumber: c.cardNumber,
//             cardHolderName: c.cardHolderName,
//             cardExpirationDate: new Date(c.cardExpirationDate),
//             cardCVV: c.cardCVV,
//             cardBrand: brandUpper,
//             preferredCard: Boolean(c.preferredCard),
//             costumer: costumer,
//           } as any);

//           // >>> CORREÇÃO TÍPICA: forçar o retorno para CreditCard via unknown cast
//           const savedCard = (await cardRepo.save(newCard as any)) as unknown as CreditCard;
//           console.log(`CreditCard id=${savedCard.id} criado.`);
//         }
//       }

//       // deletar cartões que não vieram no payload (replace)
//       const existingCards: CreditCard[] = await cardRepo.find({ where: { costumer: { id: costumer.id } } as any });
//       for (const ex of existingCards) {
//         if (!incomingCardIds.includes(Number(ex.id))) {
//           await cardRepo.remove(ex);
//           console.log(`CreditCard id=${ex.id} removido por não constar no payload.`);
//         }
//       }

//       const cardCount = await cardRepo.count({ where: { costumer: { id: costumer.id } } as any });
//       if (cardCount === 0) throw new Error("É necessário ter pelo menos 1 cartão cadastrado.");
//     }

//     // -----------------------------
//     // Salvar client (campos do client modificados)
//     // -----------------------------

//     await costumerRepo.save(costumer);

//     //Recarregar o cliente atualizado e remove senha de retorno
//     const fullyUpdated = await costumerRepo.findOne({ where: { id: costumer.id }, relations: ["addresses", "creditCards"] });
//     if (!fullyUpdated) throw new Error("Erro ao recarregar cliente atualizado.");

//     const asAny = fullyUpdated as any;
//     delete asAny.password;
//     return asAny;
//   }
// }

//BLOCO 3
import { getCustomRepository, Not } from "typeorm";
import bcrypt from "bcryptjs";
import { CostumersRepositories } from "../../repositories/CostumersRepositories";
import { ICostumerRequest } from "../../Interface/ICostumerInterface";
import { AddressesRepositories } from "../../repositories/AddressesRepositories";
import { CreditCardsRepositories } from "../../repositories/CreditCardsRepositories";
import { Address, AddressType } from "../../entities/Address";
import { CreditCard } from "../../entities/CreditCard";

/**
 * UpdateCostumerService
 * Mantive seus comentários originais.
 *
 * Adicionei LOGs estratégicos para validar passo-a-passo:
 *  - início do serviço
 *  - payload recebido
 *  - arrays incomingAddresses / incomingCards
 *  - para cada item: log antes de buscar, log do registro encontrado, log após save
 *  - contagens e erros esperados
 */

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

    // DEBUG: mostra o payload recebido para ajudar no debug
    console.log("Payload recebido:", JSON.stringify(payload, null, 2));

    // Atualizar os campos simples
    if (payload.name !== undefined) costumer.name = String(payload.name).trim();
    if (payload.phone !== undefined) costumer.phone = String(payload.phone).trim();
    if (payload.gender !== undefined) costumer.gender = String(payload.gender).trim();
    if (payload.birthdaydate !== undefined) costumer.birthdaydate = new Date(payload.birthdaydate as any);

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

    // -----------------------------
    // Endereços
    // -----------------------------
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

      // deletions (replace behavior)
      const existingAddresses = (await addressRepo.find({ where: { costumer: { id: costumer.id } } as any })) as Address[];
      console.log("existing addresses in DB (count):", existingAddresses.length);
      for (const ex of existingAddresses) {
        if (!incomingIds.includes(Number(ex.id))) {
          console.log(`Removing address id=${ex.id} because not in payload`);
          await addressRepo.remove(ex);
        }
      }

      const billingAddCount = await addressRepo.count({ where: { costumer: { id: costumer.id }, type: "BILLING" } as any });
      const deliveryAddCount = await addressRepo.count({ where: { costumer: { id: costumer.id }, type: "DELIVERY" } as any });
      console.log("billingAddCount:", billingAddCount, "deliveryAddCount:", deliveryAddCount);
    } else {
      console.log("No incomingAddresses provided - skipping address sync.");
    }

    // -----------------------------
    // Cartões
    // -----------------------------
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

          // antes
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

      // deletar os cartões que não vieram no payload (replace)
      const existingCards = (await cardRepo.find({ where: { costumer: { id: costumer.id } } as any })) as CreditCard[];
      console.log("existing cards in DB (count):", existingCards.length);
      for (const ex of existingCards) {
        if (!incomingCardIds.includes(Number(ex.id))) {
          console.log(`Removing card id=${ex.id} because not in payload`);
          await cardRepo.remove(ex);
        }
      }
    } else {
      console.log("No incoming cards provided - skipping card sync.");
    }
   
    // Salvar client, apenas campos escalares do cliente (evita regravar as relações com valores antigos)
    // -----------------------------
    const updatePayload: any = {
      id: costumer.id,
      name: costumer.name,
      email: costumer.email,
      phone: costumer.phone,
      gender: costumer.gender,
      birthdaydate: costumer.birthdaydate,
      cpf: costumer.cpf,
      // só inclua password se foi alterada (já está hasheada)
    };
    if (costumer.password) {
      updatePayload.password = costumer.password;
    }

    // Usa save com um object plain (ou update). Isso evita que TypeORM tente persistir costumer.addresses/creditCards
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

