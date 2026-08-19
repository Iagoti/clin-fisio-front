export interface PagamentoRequest {
  cdPagamento?: number;
  cdAgendamento?: number;
  cdPacote?: number;
  cdPaciente: number;
  valor: number;
  formaPagamento?: number;
  status?: number;
  dtVencimento?: string;
  observacoes?: string;
}

export interface BaixarPagamentoRequest {
  formaPagamento?: number;
  dtPagamento?: string;
}
