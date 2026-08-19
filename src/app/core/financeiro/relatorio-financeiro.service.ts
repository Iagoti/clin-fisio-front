import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../../environment';
import { DashboardFinanceiroResponse, FluxoCaixaPontoResponse } from '../../models/financeiro/RelatorioFinanceiro';

const HTTP_TIMEOUT_MS = 30_000;

@Injectable({ providedIn: 'root' })
export class RelatorioFinanceiroService {
  constructor(private http: HttpClient) {}

  dashboard(): Observable<DashboardFinanceiroResponse> {
    return this.http.get<DashboardFinanceiroResponse>(`${environment.apiUrl}/financeiro/dashboard`).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  fluxoCaixa(dtInicio: string, dtFim: string): Observable<FluxoCaixaPontoResponse[]> {
    const params = new URLSearchParams({ dtInicio, dtFim });
    return this.http
      .get<FluxoCaixaPontoResponse[]>(`${environment.apiUrl}/financeiro/fluxo-caixa?${params.toString()}`)
      .pipe(timeout(HTTP_TIMEOUT_MS));
  }
}
