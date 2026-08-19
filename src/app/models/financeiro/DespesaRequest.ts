export interface DespesaRequest {
  cdDespesa?: number;
  cdCategoriaDespesa: number;
  descricao: string;
  valor: number;
  dtVencimento: string;
  observacoes?: string;
}

export interface BaixarDespesaRequest {
  dtPagamento?: string;
}
