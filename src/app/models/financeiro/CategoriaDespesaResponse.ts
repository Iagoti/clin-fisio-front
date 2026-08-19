import { CodigoDescricao } from '../usuario/UsuarioResponse';

export interface CategoriaDespesaResponse {
  cdCategoriaDespesa: number;
  nmCategoria: string;
  stCategoria: CodigoDescricao;
  dtCadastro: string;
}
