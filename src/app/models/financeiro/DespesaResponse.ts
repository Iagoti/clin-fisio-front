import { CodigoDescricao } from '../usuario/UsuarioResponse';

export interface DespesaResponse {
  cdDespesa: number;
  cdCategoriaDespesa: number;
  nmCategoria: string;
  descricao: string;
  valor: number;
  status: CodigoDescricao;
  dtVencimento: string;
  dtPagamento?: string;
  observacoes?: string;
  dtCadastro: string;
}
