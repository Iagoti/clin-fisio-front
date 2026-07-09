/** Espelha o enum `TipoUsuario` do backend. */
export enum TipoUsuarioEnum {
  ADMINISTRADOR = 1,
  RECEPCAO = 2,
}

export const TIPO_USUARIO_LABELS: Record<TipoUsuarioEnum, string> = {
  [TipoUsuarioEnum.ADMINISTRADOR]: 'Administrador',
  [TipoUsuarioEnum.RECEPCAO]: 'Recepção',
};

export const TIPO_USUARIO_OPCOES = Object.values(TipoUsuarioEnum)
  .filter((valor): valor is TipoUsuarioEnum => typeof valor === 'number')
  .map(codigo => ({ codigo, descricao: TIPO_USUARIO_LABELS[codigo] }));
