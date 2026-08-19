/** Formato das claims do JWT emitido por /auth/login (ver JwtService no backend). */
export interface JwtPayload {
  sub?: string;
  cdUsuario?: number;
  permissoes?: string[];
  roles?: string[];
  /** Versão do formato das claims — usada para invalidar tokens de um formato antigo. */
  ver?: number;
  iat?: number;
  exp?: number;
}

/** Dados do usuário logado, persistidos em localStorage após o login. */
export interface AuthUser {
  cdUsuario: number;
  nmUsuario: string;
  roles: string[];
}
