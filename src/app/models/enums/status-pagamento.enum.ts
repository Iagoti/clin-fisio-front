/** Espelha o enum `StatusPagamentoEnum` do backend. */
export enum StatusPagamentoEnum {
  PENDENTE = 1,
  PAGO = 2,
  CANCELADO = 3,
}

export const STATUS_PAGAMENTO_LABELS: Record<StatusPagamentoEnum, string> = {
  [StatusPagamentoEnum.PENDENTE]: 'Pendente',
  [StatusPagamentoEnum.PAGO]: 'Pago',
  [StatusPagamentoEnum.CANCELADO]: 'Cancelado',
};

export const STATUS_PAGAMENTO_OPCOES = Object.values(StatusPagamentoEnum)
  .filter((valor): valor is StatusPagamentoEnum => typeof valor === 'number')
  .map(value => ({ value, label: STATUS_PAGAMENTO_LABELS[value] }));
