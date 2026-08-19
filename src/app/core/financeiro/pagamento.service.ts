import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../../environment';
import { PagamentoResponse } from '../../models/financeiro/PagamentoResponse';
import { PagamentoRequest, BaixarPagamentoRequest } from '../../models/financeiro/PagamentoRequest';

const HTTP_TIMEOUT_MS = 30_000;

export interface PagamentoFiltro {
  cdPaciente?: number;
  status?: number;
  dtInicio?: string;
  dtFim?: string;
}

@Injectable({ providedIn: 'root' })
export class PagamentoService {
  constructor(private http: HttpClient) {}

  listar(filtros?: PagamentoFiltro): Observable<PagamentoResponse[]> {
    let url = `${environment.apiUrl}/financeiro/pagamento`;
    if (filtros) {
      const params = new URLSearchParams();
      if (filtros.cdPaciente != null) params.set('cdPaciente', String(filtros.cdPaciente));
      if (filtros.status != null) params.set('status', String(filtros.status));
      if (filtros.dtInicio) params.set('dtInicio', filtros.dtInicio);
      if (filtros.dtFim) params.set('dtFim', filtros.dtFim);
      const query = params.toString();
      if (query) url += '?' + query;
    }
    return this.http.get<PagamentoResponse[]>(url).pipe(timeout(HTTP_TIMEOUT_MS));
  }

  obterPorId(id: number): Observable<PagamentoResponse> {
    return this.http.get<PagamentoResponse>(`${environment.apiUrl}/financeiro/pagamento/${id}`).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  salvar(body: PagamentoRequest): Observable<PagamentoResponse> {
    return this.http.post<PagamentoResponse>(`${environment.apiUrl}/financeiro/pagamento`, body).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  atualizar(body: PagamentoRequest): Observable<PagamentoResponse> {
    return this.http.post<PagamentoResponse>(`${environment.apiUrl}/financeiro/pagamento/update`, body).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  baixar(id: number, body: BaixarPagamentoRequest): Observable<PagamentoResponse> {
    return this.http.post<PagamentoResponse>(`${environment.apiUrl}/financeiro/pagamento/${id}/baixar`, body).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }

  cancelar(id: number): Observable<PagamentoResponse> {
    return this.http.post<PagamentoResponse>(`${environment.apiUrl}/financeiro/pagamento/${id}/cancelar`, {}).pipe(
      timeout(HTTP_TIMEOUT_MS)
    );
  }
}
