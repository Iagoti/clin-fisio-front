/** Espelha o enum `TipoAtendimentoEnum` do backend. */
export enum TipoAtendimentoEnum {
  FISIOTERAPIA = 1,
  PILATES = 2,
}

export const TIPO_ATENDIMENTO_LABELS: Record<TipoAtendimentoEnum, string> = {
  [TipoAtendimentoEnum.FISIOTERAPIA]: 'Fisioterapia',
  [TipoAtendimentoEnum.PILATES]: 'Pilates',
};

export const TIPO_ATENDIMENTO_OPCOES = Object.values(TipoAtendimentoEnum)
  .filter((valor): valor is TipoAtendimentoEnum => typeof valor === 'number')
  .map(value => ({ value, label: TIPO_ATENDIMENTO_LABELS[value] }));
