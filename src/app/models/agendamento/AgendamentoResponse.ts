import { CodigoDescricao } from '../paciente/PacienteResponse';

export interface AgendamentoResponse {
  cdAgendamento?: number;
  cdPaciente?: number;
  nmPaciente?: string;
  tipoAtendimento?: CodigoDescricao;
  dataAgendamento?: string;
  horaAgendamento?: string;
  status?: CodigoDescricao;
  valor?: number;
  observacoes?: string;
  dtCadastro?: string;
}
