import { getCustomRepository } from "typeorm";
import { PriceGroupRepository } from "../../repositories/PriceGroupRepository";
import { IPriceGroupRequest } from "../../Interface/IPriceGroupInterface";

export class CreatePriceGroupService {
  async execute(data: IPriceGroupRequest) {
    const {
      name,
      description,
      margin,
      minAllowedMargin = 0,
      maxAllowedDiscount = 0,
      requiresManagerApprovalBelowMargin = false,
      active = true,
    } = data;

    if (!name || name.trim().length === 0) {
      throw new Error("Nome do grupo de precificação é obrigatório.");
    }

    if (margin === undefined || margin === null || isNaN(Number(margin))) {
      throw new Error("Margem (margin) é obrigatória e deve ser um número.");
    }

    const m = Number(margin);
    const minM = Number(minAllowedMargin);
    const maxD = Number(maxAllowedDiscount);

    if (m < 0 || m > 1) throw new Error("Margin deve estar entre 0 e 1 (ex: 0.30).");
    if (minM < 0 || minM > 1) throw new Error("minAllowedMargin deve estar entre 0 e 1.");
    if (maxD < 0 || maxD > 1) throw new Error("maxAllowedDiscount deve estar entre 0 e 1.");
    if (minM > m) throw new Error("minAllowedMargin não pode ser maior que margin.");

    const repo = getCustomRepository(PriceGroupRepository);

    const exists = await repo.findOne({ where: { name } });
    if (exists) throw new Error("Já existe um grupo de precificação com esse nome.");

    const priceGroup = repo.create({
      name: name.trim(),
      description: description?.trim(),
      margin: m,
      minAllowedMargin: minM,
      maxAllowedDiscount: maxD,
      requiresManagerApprovalBelowMargin: Boolean(requiresManagerApprovalBelowMargin),
      active: Boolean(active),
    });

    await repo.save(priceGroup);
    return priceGroup;
  }
}
