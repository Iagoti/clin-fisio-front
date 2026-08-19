export interface DashboardFinanceiroResponse {
  totalAReceber: number;
  recebidoNoMes: number;
  totalAPagar: number;
  pagoNoMes: number;
  saldoPeriodo: number;
  inadimplencia: number;
}

export interface FluxoCaixaPontoResponse {
  data: string;
  entradas: number;
  saidas: number;
  saldoDia: number;
  saldoAcumulado: number;
}
