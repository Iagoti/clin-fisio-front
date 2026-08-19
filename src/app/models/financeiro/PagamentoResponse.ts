import { CodigoDescricao } from '../usuario/UsuarioResponse';

export interface PagamentoResponse {
  cdPagamento: number;
  cdAgendamento?: number;
  cdPacote?: number;
  cdPaciente: number;
  nmPaciente: string;
  valor: number;
  formaPagamento?: CodigoDescricao;
  status: CodigoDescricao;
  dtVencimento?: string;
  dtPagamento?: string;
  observacoes?: string;
  dtCadastro: string;
}
