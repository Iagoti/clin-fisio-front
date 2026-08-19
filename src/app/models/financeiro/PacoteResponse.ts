import { CodigoDescricao } from '../usuario/UsuarioResponse';

export interface PacoteResponse {
  cdPacote: number;
  cdPaciente: number;
  nmPaciente: string;
  qtSessoesTotal: number;
  qtSessoesConsumidas: number;
  sessoesRestantes: number;
  valor: number;
  dtInicio: string;
  dtConclusao?: string;
  status: CodigoDescricao;
  dtCadastro: string;
}

export interface IniciarPacoteRequest {
  cdPaciente: number;
}
