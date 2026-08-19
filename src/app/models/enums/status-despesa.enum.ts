/** Espelha o enum `StatusDespesaEnum` do backend. */
export enum StatusDespesaEnum {
  PENDENTE = 1,
  PAGO = 2,
  CANCELADO = 3,
}

export const STATUS_DESPESA_LABELS: Record<StatusDespesaEnum, string> = {
  [StatusDespesaEnum.PENDENTE]: 'Pendente',
  [StatusDespesaEnum.PAGO]: 'Pago',
  [StatusDespesaEnum.CANCELADO]: 'Cancelado',
};

export const STATUS_DESPESA_OPCOES = Object.values(StatusDespesaEnum)
  .filter((valor): valor is StatusDespesaEnum => typeof valor === 'number')
  .map(value => ({ value, label: STATUS_DESPESA_LABELS[value] }));
