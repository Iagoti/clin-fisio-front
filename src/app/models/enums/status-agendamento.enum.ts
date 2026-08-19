/** Espelha o enum `StatusAgendamentoEnum` do backend. */
export enum StatusAgendamentoEnum {
  AGENDADO = 1,
  CONFIRMADO = 2,
  CONCLUIDO = 3,
  CANCELADO = 4,
  FALTOU = 5,
}

export const STATUS_AGENDAMENTO_LABELS: Record<StatusAgendamentoEnum, string> = {
  [StatusAgendamentoEnum.AGENDADO]: 'Agendado',
  [StatusAgendamentoEnum.CONFIRMADO]: 'Confirmado',
  [StatusAgendamentoEnum.CONCLUIDO]: 'Concluído',
  [StatusAgendamentoEnum.CANCELADO]: 'Cancelado',
  [StatusAgendamentoEnum.FALTOU]: 'Faltou',
};

export const STATUS_AGENDAMENTO_OPCOES = Object.values(StatusAgendamentoEnum)
  .filter((valor): valor is StatusAgendamentoEnum => typeof valor === 'number')
  .map(value => ({ value, label: STATUS_AGENDAMENTO_LABELS[value] }));
