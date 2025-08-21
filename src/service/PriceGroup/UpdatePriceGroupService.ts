import { getCustomRepository } from "typeorm";
import { PriceGroupRepository } from "../../repositories/PriceGroupRepository";
import { IPriceGroupRequest } from "../../Interface/IPriceGroupInterface";

export class UpdatePriceGroupService {
  async execute(id: number, data: Partial<IPriceGroupRequest>) {
    const repo = getCustomRepository(PriceGroupRepository);

    const group = await repo.findOne(id);
    if (!group) throw new Error("Grupo de precificação não encontrado.");

    // Se alterando nome, verificar duplicidade
    if (data.name && data.name.trim() !== group.name) {
      const other = await repo.findOne({ where: { name: data.name.trim() } });
      if (other && other.id !== group.id) {
        throw new Error("Outro grupo com esse nome já existe.");
      }
      group.name = data.name.trim();
    }

    if (data.description !== undefined) group.description = data.description?.trim() ?? null;

    if (data.margin !== undefined) {
      const m = Number(data.margin);
      if (isNaN(m) || m < 0 || m > 1) throw new Error("Margin deve estar entre 0 e 1.");
      group.margin = m;
      // se minAllowedMargin já existe e for maior que novo margin -> erro
      if (group.minAllowedMargin !== undefined && Number(group.minAllowedMargin) > m) {
        throw new Error("minAllowedMargin não pode ser maior que margin.");
      }
    }

    if (data.minAllowedMargin !== undefined) {
      const minM = Number(data.minAllowedMargin);
      if (isNaN(minM) || minM < 0 || minM > 1) throw new Error("minAllowedMargin deve estar entre 0 e 1.");
      if (group.margin !== undefined && minM > Number(group.margin)) {
        throw new Error("minAllowedMargin não pode ser maior que margin.");
      }
      group.minAllowedMargin = minM;
    }

    if (data.maxAllowedDiscount !== undefined) {
      const maxD = Number(data.maxAllowedDiscount);
      if (isNaN(maxD) || maxD < 0 || maxD > 1) throw new Error("maxAllowedDiscount deve estar entre 0 e 1.");
      group.maxAllowedDiscount = maxD;
    }

    if (data.requiresManagerApprovalBelowMargin !== undefined) {
      group.requiresManagerApprovalBelowMargin = Boolean(data.requiresManagerApprovalBelowMargin);
    }

    if (data.active !== undefined) {
      group.active = Boolean(data.active);
    }

    await repo.save(group);
    return group;
  }
}
