/**
 * Espelha o retorno do backend (UsuarioResponse).
 * dtCadastro vem como string ISO (LocalDateTime serializado).
 * stUsuario e tpUsuario vêm como objetos { codigo, descricao }.
 */
export interface CodigoDescricao {
  codigo: number;
  descricao: string;
}

export interface UsuarioResponse {
  nmUsuario: string;
  email: string;
  login: string;
  stUsuario: CodigoDescricao;
  tpUsuario: CodigoDescricao;
  dtCadastro: string;
}
