export interface UsuarioRequest {
  cdUsuario?: number;
  nome: string;
  email: string;
  login: string;
  senha?: string;
  stUsuario: number;
  tipo: number;
  dataCadastro?: string;
}
