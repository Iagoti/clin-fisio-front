/** Espelha o enum `AtivoInativoEnum` do backend (1 = Ativo, 2 = Inativo). */
export enum AtivoInativoEnum {
  ATIVO = 1,
  INATIVO = 2,
}

export const ATIVO_INATIVO_LABELS: Record<AtivoInativoEnum, string> = {
  [AtivoInativoEnum.ATIVO]: 'Ativo',
  [AtivoInativoEnum.INATIVO]: 'Inativo',
};

export const ATIVO_INATIVO_OPCOES = Object.values(AtivoInativoEnum)
  .filter((valor): valor is AtivoInativoEnum => typeof valor === 'number')
  .map(value => ({ value, label: ATIVO_INATIVO_LABELS[value] }));
