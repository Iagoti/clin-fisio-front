/** Espelha o enum `FormaPagamentoEnum` do backend. */
export enum FormaPagamentoEnum {
  DINHEIRO = 1,
  PIX = 2,
  CARTAO_CREDITO = 3,
  CARTAO_DEBITO = 4,
  TRANSFERENCIA = 5,
}

export const FORMA_PAGAMENTO_LABELS: Record<FormaPagamentoEnum, string> = {
  [FormaPagamentoEnum.DINHEIRO]: 'Dinheiro',
  [FormaPagamentoEnum.PIX]: 'Pix',
  [FormaPagamentoEnum.CARTAO_CREDITO]: 'Cartão de crédito',
  [FormaPagamentoEnum.CARTAO_DEBITO]: 'Cartão de débito',
  [FormaPagamentoEnum.TRANSFERENCIA]: 'Transferência',
};

export const FORMA_PAGAMENTO_OPCOES = Object.values(FormaPagamentoEnum)
  .filter((valor): valor is FormaPagamentoEnum => typeof valor === 'number')
  .map(value => ({ value, label: FORMA_PAGAMENTO_LABELS[value] }));
