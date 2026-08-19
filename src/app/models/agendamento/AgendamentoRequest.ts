export interface AgendamentoRequest {
  cdAgendamento?: number;
  cdPaciente: number;
  tipoAtendimento: number;
  dataAgendamento: string;
  horaAgendamento: string;
  status?: number;
  valor?: number;
  observacoes?: string;
  dtCadastro?: string;
}
