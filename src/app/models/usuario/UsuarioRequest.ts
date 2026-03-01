/**
 * Espelha o que o backend espera (UsuarioRequest).
 * tipo é o código/número do tipo de usuário (Long no backend), não objeto.
 */
export interface UsuarioRequest {
  nome: string;
  email: string;
  login: string;
  senha?: string;
  stUsuario: number;
  tipo: number;
}
