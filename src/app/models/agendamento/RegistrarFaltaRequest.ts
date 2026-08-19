export interface RegistrarFaltaRequest {
  cdAgendamento: number;
  comAtestado: boolean;
  arquivoAtestadoBase64?: string;
  nomeArquivoAtestado?: string;
  tipoArquivoAtestado?: string;
}
