import { RoleResumoResponse } from '../role/RoleResumoResponse';

/**
 * Espelha o retorno do backend (UsuarioResponse).
 * dtCadastro vem como string ISO (LocalDateTime serializado).
 * stUsuario vem como objeto { codigo, descricao }.
 */
export interface CodigoDescricao {
  codigo: number;
  descricao: string;
}

export interface UsuarioResponse {
  cdUsuario?: number;
  id?: number;
  nmUsuario: string;
  email: string;
  login: string;
  stUsuario: CodigoDescricao;
  roles: RoleResumoResponse[];
  dtCadastro: string;
}
