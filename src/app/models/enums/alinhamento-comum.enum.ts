/**
 * Opções de alinhamento compartilhadas entre os campos de Anamnese e
 * Avaliação Postural (quadril e varo/valgo aparecem em ambos os passos).
 */
export enum AlinhamentoQuadrilEnum {
  ALINHADO = 'Alinhado',
  INCLINACAO_DIREITA = 'Inclinação à Dir',
  INCLINACAO_ESQUERDA = 'Inclinação à Esq',
  ROTACAO_DIREITA = 'Rotação à Dir',
  ROTACAO_ESQUERDA = 'Rotação à Esq',
}

export enum AlinhamentoVaroValgoEnum {
  NORMAL = 'Normal',
  VARO = 'Varo',
  VALGO = 'Valgo',
}
