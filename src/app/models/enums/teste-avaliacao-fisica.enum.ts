/** Catálogo de testes exibidos no passo de Avaliação Física. */
export enum TesteAvaliacaoFisicaEnum {
  FLEXAO_LOMBAR = 'Flexão Lombar (Tocou nos pés)',
  EXTENSAO_OMBRO = 'Extensão de Ombro (Atrás da cabeça)',
  ROTACAO_TRONCO = 'Rotação de Tronco (Sentado)',
  AGACHAMENTO_PROFUNDO = 'Agachamento Profundo',
  ELEVACAO_CALCANHARES = 'Elevação de Calcanhares (Unilateral)',
  PRANCHA = 'Prancha (Tempo de Sustentação)',
  FLEXAO_BRACO = 'Flexão de Braço (Número de Repetições)',
  ABDOMINAL = 'Abdominal (Número de Repetições)',
  MOBILIDADE_QUADRIL = 'Mobilidade de Quadril (Rotação Externa)',
  MOBILIDADE_TORNOZELO = 'Mobilidade de Tornozelo (Dorsiflexão)',
}

export const TESTES_AVALIACAO_FISICA_OPCOES = Object.values(TesteAvaliacaoFisicaEnum);
