/** Espelha o enum `StatusPacoteEnum` do backend. */
export enum StatusPacoteEnum {
  ATIVO = 1,
  CONCLUIDO = 2,
  CANCELADO = 3,
}

export const STATUS_PACOTE_LABELS: Record<StatusPacoteEnum, string> = {
  [StatusPacoteEnum.ATIVO]: 'Ativo',
  [StatusPacoteEnum.CONCLUIDO]: 'Concluído',
  [StatusPacoteEnum.CANCELADO]: 'Cancelado',
};
