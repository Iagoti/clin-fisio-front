import { CodigoDescricao } from '../usuario/UsuarioResponse';
import { PermissaoResponse } from './PermissaoResponse';

export interface RoleResponse {
  cdRole: number;
  nmRole: string;
  dsRole: string;
  stRole: CodigoDescricao;
  flSistema: boolean;
  permissoes: PermissaoResponse[];
  dtCadastro: string;
}
